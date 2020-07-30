const fs = require("fs")
const _ = require("lodash")
const jssoup = require('jssoup').default
const promise = require("bluebird")
const util = require('util')
//an incense has been lit in prayer that this is the only place I need to use bluebird in this project

const models = require("./models.js")

link_re = new RegExp(/\[\[([^\[]+)\]\]/gm)


// largely just copied from the v1 python implimentation 
function processTwine(raw, cb){
	var soup = new jssoup(raw)
	story_title = soup.find("title").text
	raw_passages = soup.findAll("tw-passagedata")
	promise.map(raw_passages, function(p){return processPassage(p)})
	.then(function(passages){
		cb({
			title:story_title,
			raw_text:raw,
			passages:passages
		})
	})
	
}

function processPassage(passage){
	attrs = passage.attrs
	//create the sugarcube id format 
	attrs['passage_id'] = "passage-"+attrs["name"].toLowerCase().replace(" ", "-")
	attrs['title'] = attrs["name"]
	
	link_raws = []
	while((match = link_re.exec(passage.text)) !== null){
    	link_raws.push(match[1]);
	}
	return promise.map(link_raws, function(raw){
		if(raw.includes("->")){
			return raw.split("->")[0]
		} else if(raw.includes("|")){
			return raw.split("|")[1]
		} else if(raw.includes("-&gt;")){
			return raw.split("-&gt;")[1]
		} else {
			return raw
		}
	}).then(function(links){
		return passage_schema = {
			passage_id: passage.attrs.passage_id,
			title: passage.attrs.title,
			position: passage.attrs.position,
			size: passage.attrs.size,
			links: links
		}
	})
}

//to check new uploaded raw stories
function validateTwine(uploaded_raw, cb){
	var soup = new jssoup(uploaded_raw)
	var has_loom_js = uploaded_raw.includes("{LOOM_JS}")
	var has_loom_css = uploaded_raw.includes("{LOOM_CSS}")
	var twine_tag = soup.find("tw-storydata")
	if(twine_tag){
		var is_twine = true
		var is_sugarcube = (twine_tag["attrs"]["format"] == "SugarCube")
	}else{
		var is_twine = false
		var is_sugarcube = false
	}
	//this is a bit of an explanatory headache- because "true" values here indicate that the error key is /not/ applicable.
	// really the truthy value is "this test succeeded", and the key is "the error name if this test failed"
	// The syntax is confusing. I'm confident that there's a less insane way to impliment this, but I'm too lazy to 
	// figure it out rn. 
	var err_schema = {"Missing {LOOM_JS} tag": has_loom_js, "Missing {LOOM_CSS} tag": has_loom_css, "Is not a twine story": is_twine, "Is not a sugarcube story":is_sugarcube}
	var errors = _.toPairs(err_schema).map(function(err){
		if(!err[1]){
			return err[0]
		}else{
			return null
		}
	}).filter(function(el){return el!=null})
	cb(errors, uploaded_raw)
}
	
exports.processTwine = processTwine
exports.validateTwine = validateTwine
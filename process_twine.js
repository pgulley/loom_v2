const fs = require("fs")
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

module.exports = processTwine

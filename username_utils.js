const adjective_list = ["shy", "anxious", "fiery", "nervous", "nice", "pessimistic", "optimistic", "calm", "generous", "clever",
			"ambient", "jaunty", "morose", "toxic", "sleepy", "sinful", "raunchy", "tall", "short"]
const noun_list = ["developer", "street", "lightbulb", "apple", "pear", "cherry", "electron", "proton", "phenomenon", "candle",
			 "ameoba", "sunrise","thought", "daemon", "ghost", "ghoti", "fish", "tune", "leaf", "tree"]

function random_choice(items){
	return items[Math.floor(Math.random()*items.length)] 
}

function get_random_name(){
	return `${random_choice(adjective_list)} ${random_choice(noun_list)}`
}

exports.random_name = get_random_name
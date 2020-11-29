module.exports = async function(model, json) {
    let data = await model.findOne({ json });
    if(data) return true
    else return false
}
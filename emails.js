module.exports = {
  codes:["Kake", "fake"],
emails:["mark@dlux.io", "steve@dlux.io"],
match: function(email){const i = module.exports.emails.indexOf(email);console.log(module.exports.codes[i]);return module.exports.codes[i]}
}

module.exports = {
  codes:["Kake", "fake"],
emails:["mark@dlux.io", "steve@dlux.io"],
match: function(email){const i = module.exports.emails.indexOf(email);return module.exports.codes[i]}
}

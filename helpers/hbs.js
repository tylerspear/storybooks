const moment = require('moment')

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    truncate: function (str, len) {
        if(str.length > len && str.length > 0){
            //add a space at the end
            let new_str = str + ' '
            //take the string from 0 to max length
            new_str = str.substr(0, len)
            //take the string from 0 to the last space char
            new_str = str.substr(0, new_str.lastIndexOf(' '))
            //if new_str length is more than 0 return it else the original string - max length
            new_str = new_str.length > 0 ? new_str : str.substr(0, len)
            //add a ...
            return new_str + '...'
        }
        return str
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
          if (floating) {
            return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
          } else {
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
          }
        } else {
          return ''
        }
    },
}
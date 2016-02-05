function subjectIsNotEmpty(input){
  return !input.trim() ? 'subject cannot be blank' : true ;
}

function bodyIsNotEmpty(input){
  return !input.trim() ? 'body cannot be blank' : true ;
}

function categoryIsNotEmpty(input){
  return !input.trim() ? 'category cannot be blank' : true ;
}

function formIsValid(input) {
  var errors = [];
  errors.push(subjectIsNotEmpty(input.subject))
  errors.push(bodyIsNotEmpty(input.body))
  errors.push(categoryIsNotEmpty(input.cat_name))
  return errors.filter(function (error){
    return error !== true;
  })
}

module.exports = formIsValid;

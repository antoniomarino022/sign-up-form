import validator from 'validator';
import PasswordValidator from 'password-validator';

// Definizione dello schema della password
const passwordSchema = new PasswordValidator();
passwordSchema
  .is().min(8)                              // Lunghezza minima di 8 caratteri
  .has().uppercase()                       // Deve contenere almeno una lettera maiuscola
  .has().lowercase()                       // Deve contenere almeno una lettera minuscola
  .has().digits()                          // Deve contenere almeno un numero
  .not().spaces();                         // Non deve contenere spazi





function validateEmail(email: string) {
  return email && validator.isEmail(email);
}


function validatePassword(password: string){
  return passwordSchema.validate(password);
}


function validateFirstName(firstName: string){
  return firstName && validator.isAlphanumeric(firstName) && firstName.length >= 3 && firstName.length <= 20;
}


function validateLastName(lastName: string){
    return lastName && validator.isAlphanumeric(lastName) && lastName.length >= 3 && lastName.length <= 20;
  }


function validateTel(tel:string){
    return tel.length === 9 && validator.isNumeric(tel);
  }


  function validateCompany(company:string){
    return company
  }



export {
  validateEmail,
  validatePassword,
  validateFirstName,
  validateLastName,
  validateTel,
  validateCompany
}
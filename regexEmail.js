//function to check email validity
// using Regex

function myFunction() {
  var myemail = "mama@gm_ail.com";
  var patt1 = /(^([0-9A-Za-z])[\w\.-]+@{1}[\w]+\.{1}[\w]\S+)$/gi;
  var result = patt1.test(str);
  return result; //boolean true (PASS) or false (FAIL)
}


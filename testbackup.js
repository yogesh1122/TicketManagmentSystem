let newStr ="madam"
let testStr= newStr.split("")
let str =[]
for (let index = testStr.length-1; index>=testStr[0].length-1; index--) {
      
      str.push(testStr[index]) 
      
  }
  // console.log(str.join(''));
  
if(str.join('')==newStr){
  console.log('its pallidrom string');
  
}
else{
  console.log('not aplidrom');
  
}

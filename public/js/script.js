(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
// form.addEventListener('submit',(event)=>
// {
//   const title=document.getElementById('title').value;
//   const category=document.getElementById('cate').value;
//   const price=document.getElementById('price').value;
//   const quantity=document.getElementById('quant'.value);

//   if(title.)
// })

const titleField=document.getElementById('title');
const categoryField=document.getElementById('cate');
const priceField=document.getElementById('price');
const quantityField=document.getElementById('quant');
const memnameField=document.getElementById('memname');
const telphoneField=document.getElementById('telephone');

titleField.addEventListener('keypress',(event)=>
{
  if(event.key>='0' && event.key<='9')
  {
    event.preventDefault();
  }
})
categoryField.addEventListener('keypress',(event)=>
{
  if(event.key>='0' && event.key<='9')
  {
    event.preventDefault();
  }
})
priceField.addEventListener('keypress',(event)=>
{
  if((event.key>='a' && event.key<='z') ||(event.key>='A' && event.key<='Z') || event.key.length()>5)
  {
    event.preventDefault();
  }
})

telphoneField.addEventListener('keypress',(event)=>
{
  if((event.key>='a' && event.key<='z') ||(event.key>='A' && event.key<='Z') || event.key.length()>5)
  {
    event.preventDefault();
  }
})
forms.addEventListener('submit', function(event) {
  // Final validation before submission
  if (telphoneField.value.length > 10) {
      event.preventDefault(); // Prevent form submission
      errorMessage.style.display = 'block'; // Show error message
  }
});
memnameField.addEventListener('keypress',(event)=>
{ if(event.key>='0' && event.key<='9') 
  {
    event.preventDefault();
  }
})

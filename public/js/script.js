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

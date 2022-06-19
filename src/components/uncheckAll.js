export default function Movie() {
    var inputs = document.getElementById('formulario').getElementsByTagName('input');
    for(var i in inputs) {
        if(inputs[i].type === 'checkbox') {
            inputs[i].checked = false;
        }
    }
    
    var text = document.getElementById("inputSearch").value;
    if(text != null){
       document.getElementById("inputSearch").value = null;
    }
}

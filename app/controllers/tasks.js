import Controller from '@ember/controller';

let user;

checkIfLoggedId();

function checkIfLoggedId() {

    user = JSON.parse(sessionStorage.getItem("user"));

    if(!user) {
        window.location.href = "/login";
    } 

}


export default Controller.extend({

    actions: {
        addNewTask: function() {

            let taskContent = document.getElementById("inputTask").value;

            let task = {
                "content": taskContent
            }
            console.log(user);
            let username = user.name;
            var addTaskRequest = new XMLHttpRequest();
            addTaskRequest.onreadystatechange = () => { 
                if (addTaskRequest.readyState == 4 && addTaskRequest.status == 200){

                }
            }
            addTaskRequest.open("POST","http://localhost:4040/tasks?name="+username, true);
            addTaskRequest.setRequestHeader("Content-Type", "application/json");
            addTaskRequest.send(JSON.stringify(task));
        }
    }

});

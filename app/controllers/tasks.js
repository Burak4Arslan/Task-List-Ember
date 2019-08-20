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
            let username = user.name;
            var addTaskRequest = new XMLHttpRequest();
            addTaskRequest.onreadystatechange = () => { 
                if (addTaskRequest.readyState == 4 && addTaskRequest.status == 200){
                    
                    var getTasksRequest = new XMLHttpRequest();
                    getTasksRequest.onreadystatechange = () => { 
                        if (getTasksRequest.readyState == 4 && getTasksRequest.status == 200){
                            
                            let myTasks = getTasksRequest.response;
                            console.log(myTasks);
                            this.set("myTasks",myTasks);
                        }
                    }
                    getTasksRequest.open("GET","http://localhost:4040/tasks?name="+username, true);
                    getTasksRequest.setRequestHeader("Content-Type", "application/json");
                    getTasksRequest.send();

                }
            }
            addTaskRequest.open("POST","http://localhost:4040/tasks?name="+username, true);
            addTaskRequest.setRequestHeader("Content-Type", "application/json");
            addTaskRequest.send(JSON.stringify(task));
        }
    }

});

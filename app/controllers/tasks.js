import Controller from '@ember/controller';

let user;

checkIfLoggedId();

function checkIfLoggedId() {

    user = JSON.parse(sessionStorage.getItem("user"));

    if(!user) {
        window.location.href = "/login";
    }

}

getMyTasks();

function getMyTasks() {
    let username = user.name;
    var getTasksRequest = new XMLHttpRequest();
    getTasksRequest.onreadystatechange = () => { 
        if (getTasksRequest.readyState == 4 && getTasksRequest.status == 200){
            let myTasks = getTasksRequest.response;
            this.set("myTasks",JSON.parse(myTasks));
        }
    }
    getTasksRequest.open("GET","http://localhost:4040/tasks?name="+username, true);
    getTasksRequest.setRequestHeader("Content-Type", "application/json");
    getTasksRequest.send();

}


export default Controller.extend({

    actions: {
        addNewTask: function() {

            let taskContent = document.getElementById("inputTask").value;
            taskContent = taskContent.trim();

            if(!taskContent) {
                alert("Please Write A Task!");
                return;
            }

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
                            this.set("myTasks",JSON.parse(myTasks));
                            
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
        },
        logout: function() {
            sessionStorage.removeItem("user");
            window.location.href = "/login";
        }
    }

});

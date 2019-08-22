import Controller from '@ember/controller';

let user;
let self;

checkIfLoggedId();

function checkIfLoggedId() {

    user = JSON.parse(sessionStorage.getItem("user"));

    if(!user) {
        window.location.href = "/login";
    }

}

function getCompletedTaskCount() {
    let username = user.name;
    var getCompletedTaskCountRequest = new XMLHttpRequest();
    getCompletedTaskCountRequest.onreadystatechange = () => { 
        if (getCompletedTaskCountRequest.readyState == 4 && getCompletedTaskCountRequest.status == 200){
            let completedTaskCount = getCompletedTaskCountRequest.response;
            self.set("completedTaskCount",completedTaskCount);
        }
    }
    getCompletedTaskCountRequest.open("GET","http://localhost:4040/users/completedTaskCount?username="+username, true);
    getCompletedTaskCountRequest.setRequestHeader("Content-Type", "application/json");
    getCompletedTaskCountRequest.send();
}

function getMyTasks() {
    let username = user.name;
    var getTasksRequest = new XMLHttpRequest();
    getTasksRequest.onreadystatechange = () => { 
        if (getTasksRequest.readyState == 4 && getTasksRequest.status == 200){
            let myTasks = getTasksRequest.response;
            self.set("myTasks",JSON.parse(myTasks));
            getCompletedTaskCount();
        }
    }
    getTasksRequest.open("GET","http://localhost:4040/tasks?name="+username, true);
    getTasksRequest.setRequestHeader("Content-Type", "application/json");
    getTasksRequest.send();

}


export default Controller.extend({
    init: function () {
        this._super(... arguments);
        self = this;
        getMyTasks();
    },
    actions: {
        // listAllTasks: function(){
        //     self = this;
        //     getMyTasks();
        // },
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
                    document.getElementById("inputTask").value = "";
                    self = this;
                    getMyTasks();
                }
            }
            addTaskRequest.open("POST","http://localhost:4040/tasks?name="+username, true);
            addTaskRequest.setRequestHeader("Content-Type", "application/json");
            addTaskRequest.send(JSON.stringify(task));
        },
        logout: function() {
            sessionStorage.removeItem("user");
            window.location.href = "/login";
        },
        deleteTask: function(task) {
            let taskID = task.id;
            var getTasksRequest = new XMLHttpRequest();
            getTasksRequest.onreadystatechange = () => { 
                if (getTasksRequest.readyState == 4 && getTasksRequest.status == 200){
                    self = this;
                    getMyTasks();
                }
            }
            getTasksRequest.open("DELETE","http://localhost:4040/tasks?id="+taskID, true);
            getTasksRequest.setRequestHeader("Content-Type", "application/json");
            getTasksRequest.send();
        },
        completeTask: function(task) {
            let taskID = task.id;
            var getTasksRequest = new XMLHttpRequest();
            getTasksRequest.onreadystatechange = () => { 
                if (getTasksRequest.readyState == 4 && getTasksRequest.status == 200){
                    self = this;
                    getMyTasks();
                }
            }
            getTasksRequest.open("DELETE","http://localhost:4040/tasks/completed?id="+taskID, true);
            getTasksRequest.setRequestHeader("Content-Type", "application/json");
            getTasksRequest.send();
        }
    }
});

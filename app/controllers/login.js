import Controller from '@ember/controller';

sessionStorage.removeItem("user");

export default Controller.extend({

    actions: {
        signin: function() {
            let username;
            username = document.getElementById("username").value;
            username = username.trim();

            if(!username) {
                alert("Username cannot be empty");
                return;
            }

            let user = {
                "name":username
            }

            var postUserRequest = new XMLHttpRequest();
            postUserRequest.onreadystatechange = () => { 
                if (postUserRequest.readyState == 4 && postUserRequest.status == 200){

                    if(!(postUserRequest.response)) {
                        alert("Username is already Taken");
                    } else {
                        alert("Signing in Successful")
                    }

                }
            }
            postUserRequest.open("POST","http://localhost:4040/users", true);
            postUserRequest.setRequestHeader("Content-Type", "application/json");
            postUserRequest.send(JSON.stringify(user));

        },
        login: function() {
            let username;
            username = document.getElementById("username").value;

            if(!username) {
                alert("Username cannot be empty");
                return;
            }

            var loginRequest = new XMLHttpRequest();
            loginRequest.onreadystatechange = () => { 
                if (loginRequest.readyState == 4 && loginRequest.status == 200){

                    if(!(loginRequest.response)) {
                        alert("This username is not sign in yet. Please Sign in First");
                        return;
                    }

                    let user = {
                        "name":username
                    }

                    sessionStorage.setItem("user",JSON.stringify(user));
                    window.location.href = "/tasks"
                }
            }
            loginRequest.open("GET","http://localhost:4040/users?username="+username, true);
            loginRequest.setRequestHeader("Content-Type", "application/json");
            loginRequest.send();
        }
    }

});

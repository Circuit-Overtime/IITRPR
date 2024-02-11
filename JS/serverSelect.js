
    
const firebaseConfig = {
    apiKey: "AIzaSyCETWF6huNg2yy3rXJOXMzqvNe6G7xAE9Y",
    authDomain: "farmercrop-27a47.firebaseapp.com",
    projectId: "farmercrop-27a47",
    storageBucket: "farmercrop-27a47.appspot.com",
    messagingSenderId: "71580088035",
    appId: "1:71580088035:web:58d8f79d25ce5573ecf7d6"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);   
  const db = firebase.firestore();

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const checkButton = document.getElementById('selectServer');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            checkboxes.forEach(cb => {
                if (cb !== this) {
                    cb.checked = false;
                }
            });
        }
    });
});


let index = 0,
    interval = 1000;

const rand = (min, max) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const animate = star => {
  star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
  star.style.setProperty("--star-top", `${rand(-40, 80)}%`);

  star.style.animation = "none";
  star.offsetHeight;
  star.style.animation = "";
}

for(const star of document.getElementsByClassName("magic-star")) {
  setTimeout(() => {
    animate(star);
    
    setInterval(() => animate(star), 1000);
  }, index++ * (interval / 3))
}


function getCheckedCheckboxId() {
    let checkedCheckboxId = null;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedCheckboxId = checkbox.id;
        }
    });
    return checkedCheckboxId;
}


document.getElementById("selectServer").addEventListener("click", () => {
    const checkedId = getCheckedCheckboxId();
    if (checkedId) {

        serverDisplayText = "Connecting to "+checkedId+" Server..."
        typeWriterErrorHTML("serverError", serverDisplayText)
        setTimeout(() => {
            document.getElementById("loaderMask").style.zIndex = "100";
            document.getElementById("loaderMask").style.opacity = "1";
         
        }, 500);
        localStorage.setItem("userRegion", checkedId);
        db.collection("users").doc(localStorage.getItem("farmerPodUser")).update({
            region : checkedId
        }).then(() => {
            setTimeout(() => {
                location.replace("homepage.html");
            }, 1500);
        })

        
    } else {
        console.log('No checkbox is checked.');
        typeWriterErrorHTML("serverError", "Please Select a Server to Redirect");
    }
})

window.onload = e => 
{
    
    document.getElementById("loaderMask").style.zIndex = "100";
    document.getElementById("loaderMask").style.opacity = "1";
    

    if(localStorage.getItem("farmerPodUser") == null)
    {
        location.replace("userData.html");
    }
    else 
    {
        db.collection("users").doc(localStorage.getItem("farmerPodUser")).get().then((doc) => {
            if(doc.data().region == "null")
            {
                document.querySelector(".loaderMask").style.opacity = "0";
                document.querySelector(".loaderMask").style.zIndex = "-1";
                typeWriterErrorHTML("serverError", "Please Select a Server to Redirect");
            }
            else
            { 
                document.querySelector(".loaderMask").style.opacity = "0";
                document.querySelector(".loaderMask").style.zIndex = "-1";
                serverDisplayText = "You have "+doc.data().region+" Server as Default...";
                document.getElementById(doc.data().region).checked = true;
                typeWriterErrorHTML("serverError", serverDisplayText);
                localStorage.setItem("userRegion", doc.data().region);
                // setTimeout(() => {
                //     location.replace("homepage.html");
                // }, 1500);
                
            }
        });
    }

}

function typeWriterErrorHTML(idOfTextHolder, textToType, speed) {
    var i = 0;
    var speed = speed || 25; // Default speed if not provided
    document.getElementById(idOfTextHolder).innerHTML = "";
    function type() {
        if (i < textToType.length) {
            document.getElementById(idOfTextHolder).innerHTML += textToType.charAt(i);
            i++;
            setTimeout(type, speed);
        }
         if(i == textToType.length )
         {
            setTimeout(() => {
                document.getElementById(idOfTextHolder).innerHTML = "";
            }, 1500);
         }
    }
    type(); // Call the function to start the typing effect
}

document.getElementById("logout").addEventListener("click", () => {
    typeWriterErrorHTML("serverError", "Double Click to Logout From Account!");
})

document.getElementById("logout").addEventListener("dblclick", () => {
    localStorage.removeItem("farmerPodUser");
    localStorage.getItem("userRegion") != null ? localStorage.removeItem("userRegion") : null;
    location.replace("userData.html");
})
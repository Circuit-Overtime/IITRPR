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
  const storage = firebase.storage();


document.getElementById('uploadImages').addEventListener('click', function() {
    // console.log("hello")
    const input = document.getElementById('imageInput');
    input.click(); // Trigger click event on input element

    
});


document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const originalFile = event.target.files[0];
    if (file) {
        // uploadToFirebaseStorage(file);
        compressAndUpload(file, originalFile);
    }
});

// function uploadToFirebaseStorage(file)
// {
//     const storageRef = storage.ref();
//     const uploadTask = storageRef.child(localStorage.getItem("userRegion")+"/" + file.name).put(file);

//     uploadTask.on('state_changed', 
//     function(snapshot){
//         // Observe state change events such as progress, pause, and resume
//         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         // console.log('Upload is ' + progress + '% done');
//         switch (snapshot.state) {
//             case firebase.storage.TaskState.PAUSED: // or 'paused'
//                 // console.log('Upload is paused');
//                 break;
//             case firebase.storage.TaskState.RUNNING: // or 'running'
//                 // console.log('Upload is running');
//                 break;
//         }
//     }, 
//     function(error) {
//         // Handle unsuccessful uploads
//         // console.error('Error uploading image:', error);
//         alert('An error occurred while uploading the image.');
//     }, 
//     function() {
//         // Handle successful uploads on complete
//         uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
//             tagToCreate = ` <div class="mItem">
//             <img src="${downloadURL}">
//           </div>`;
//           document.getElementById("masonry").innerHTML += tagToCreate;
//         });
//     }
// );
// }






function compressAndUpload(file, originalFile) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
        const width = img.width;
        const height = img.height;

        // Calculate new dimensions for 90% compression
        const newWidth = width * 0.1;
        const newHeight = height * 0.1;

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert canvas content to a Blob
        canvas.toBlob(function(blob) {
            // Upload the compressed image to Firebase Storage
            uploadCompressedToFirebaseStorage(blob, file.name, originalFile);
        }, 'image/jpeg', 0.9); // JPEG quality set to 90%
    };

    // Set the src attribute of the img element to trigger the onload event
    img.src = URL.createObjectURL(file);
}

function uploadCompressedToFirebaseStorage(blob, fileName, originalFile) {
    document.getElementById("change_server").style.opacity = "0.4";
    document.getElementById("change_server").style.pointerEvents = "none";
    const storageRef = storage.ref();
    const uploadTask = storageRef.child('Compressed_images/'+localStorage.getItem("userRegion")+"/" + fileName).put(blob);
    
    uploadTask.on('state_changed', 
        function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    // console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    // console.log('Upload is running');
                    break;
            }
        }, 
        function(error) {
            // Handle unsuccessful uploads
            // console.error('Error uploading image:', error);
            alert('An error occurred while uploading the image.');
        }, 
        function() {
            // Handle successful uploads on complete
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                globalThis.compressedImageLink = downloadURL;
                uploadOriginalImage(originalFile, fileName)
            });
        }
    );

    // /compressedImageLink

}

function uploadOriginalImage(originalFile, fileName)
{
    var storageRef = storage.ref();
    var uploadTaskOrignal = storageRef.child(localStorage.getItem("userRegion")+"/" + fileName).put(originalFile);
    uploadTaskOrignal.on('state_changed', 
    function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                // console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                // console.log('Upload is running');
                break;
        }
    }, 
    function(error) {
        // Handle unsuccessful uploads
        // console.error('Error uploading image:', error);
    }, 
    function() {
        // Handle successful uploads on complete
        uploadTaskOrignal.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        
          let timestamp = new Date().getTime();
       
          const dataToUpdate = {
            [localStorage.getItem("farmerPodUser") + "_" + timestamp]: compressedImageLink + "AND" + downloadURL
        };
          db.collection('states').doc(localStorage.getItem("userRegion")+"/").set(dataToUpdate, {merge: true})
        .then(() => {
            updateDisplay();
        })

        });    if(localStorage.getItem("farmerPodUser") == null)
        {
            location.replace("userData.html");
        }

        document.getElementById("change_server").style.opacity = "1";
    document.getElementById("change_server").style.pointerEvents = "all";
    }
);
}

function updateDisplay()
{
    db.collection("states").doc(localStorage.getItem("userRegion") + "/")
    .onSnapshot((doc) => {
        document.getElementById("masonry").innerHTML = "";
        const data = doc.data(); // Get the entire document data
        // console.log(data);
        if (data) {
            const keys = Object.keys(data); // Get all keys from the document
            // console.log(keys.length)
            keys.forEach(key => {
               
                const value = data[key]; // Get the value associated with the current key
                // console.log(value.split("AND")[0], value.split("AND")[1])
                const dataAdded = `<div class="mItem">
                <img class="compressedImagezone" src="${value.split("AND")[0]}">
                <img class="uploadedImage" src="${value.split("AND")[1]}">
              </div>`

              document.getElementById("masonry").innerHTML += dataAdded;
            });
        }
    });


    const elementCount = document.getElementById("masonry").childElementCount;
    db.collection("states").doc(localStorage.getItem("userRegion") + "/")
        .onSnapshot((doc) => {
            const data = doc.data();
            const keys = Object.keys(data); // Get all keys from the document
            if (elementCount === keys.length) {
                document.querySelectorAll(".uploadedImage").forEach((img, index) => {
                    img.addEventListener("load", () => {
                        const compressedImagezone = document.querySelectorAll(".compressedImagezone")[index];
                        if (compressedImagezone) {
                            compressedImagezone.style.opacity = "0";
                        }
                    });
                });
            }
        });


}



window.onload = e =>
{
    document.querySelector(".loaderMask").style.opacity = "1";
    document.querySelector(".loaderMask").style.zIndex = "100";
    if(localStorage.getItem("farmerPodUser") == null)
    {
        location.replace("userData.html");
    }
    else 
    {
        setTimeout(() => {
            updateDisplay();
            document.querySelector(".loaderMask").style.opacity = "0";
            document.querySelector(".loaderMask").style.zIndex = "-1";
        }, 1000);
    }
}

//https://firebasestorage.googleapis.com/v0/b/farmercrop-27a47.appspot.com/o/Compressed_images%2FGujarat0.jpg?alt=media&token=7df1b88b-6825-4e50-b380-325cbfb6d7d1
// https://firebasestorage.googleapis.com/v0/b/farmercrop-27a47.appspot.com/o/Compressed_images%2FGujarat%2FDSCN0192.JPG?alt=media&token=d5b5d634-bb09-4f9d-b5bd-23b354a80388***https://firebasestorage.googleapis.com/v0/b/farmercrop-27a47.appspot.com/o/Compressed_images%2FGujarat%2FDSCN0192.JPG?alt=media&token=d5b5d634-bb09-4f9d-b5bd-23b354a80388


setInterval(() => {
    const elementCount = document.getElementById("masonry").childElementCount;
    db.collection("states").doc(localStorage.getItem("userRegion") + "/")
        .onSnapshot((doc) => {
            const data = doc.data();
            const keys = Object.keys(data); // Get all keys from the document
            if (elementCount === keys.length) {
                document.querySelectorAll(".uploadedImage").forEach((img, index) => {
                    img.addEventListener("load", () => {
                        const compressedImagezone = document.querySelectorAll(".compressedImagezone")[index];
                        if (compressedImagezone) {
                            compressedImagezone.style.opacity = "0";
                        }
                    });
                });
            }
        });
}, 1000);

document.getElementById("change_server").addEventListener("click", () => {
    location.replace("inermediate.html");
})
// db.collection("users").doc(localStorage.getItem("farmerPodUser"))
//         .onSnapshot((doc) => {
//             if(doc.data().allowed = false)
//             {

//             }
//         })
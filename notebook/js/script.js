var firebaseConfig = {
  apiKey: "AIzaSyDhSxT2JqH8D6jSAKb4kVtkyCk9NbVxWUc",
  authDomain: "noteapp-f2ad6.firebaseapp.com",
  databaseURL: "https://noteapp-f2ad6.firebaseio.com",
  projectId: "noteapp-f2ad6",
  storageBucket: "noteapp-f2ad6.appspot.com",
  messagingSenderId: "253541839481",
  appId: "1:253541839481:web:28df2757f9fb79c21f5aa8",
  measurementId: "G-YE08LCN0RG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics()

const dbRef = firebase.database().ref().child('Nots');

class Note {
  constructor(title = '', description = '', color = '') {
    this.title = title
    this.description = description
    this.color = color
    this.created = Date()
    this.pinned = false
  }
}

var add = document.getElementById('create');
add.onclick = function () {
  var title = document.getElementById('title').value;
  var description = document.getElementById('comment').value;
  var color = document.getElementById('datalist-input').value;
  console.log(color)

  var Nots = new Note(title, description, color);

  dbRef.push(Nots);
}



dbRef.once('value', function (snapshot) {
  snapshot.forEach(function (childSnapshot) {
    childData = childSnapshot.val();

    var noteKet = childSnapshot.key;
    var noteContainer = document.createElement("div");
    var noteTitle = document.createElement("h1");
    var noteContent = document.createElement("p");
    var date = document.createElement("small");
    var pinn = document.createElement("button");
    var pinnImg = document.createElement("img");
    var button = document.createElement("button");
    var labelPinn = document.createElement("small");
    noteContainer.setAttribute('data-id', noteKet)

    var RedHolder = document.getElementById("colred");
    var GreenHolder = document.getElementById("colgreen");
    var BlueHolder = document.getElementById("colblue");

    var pinnRed = document.getElementById("pinnred");
    var pinnGreen = document.getElementById("pinngreen");
    var pinnBlue = document.getElementById("pinnblue");


    if (childData.color == "Red") {
      noteContainer.className = "note-container-red";
      if (childData.pinned == false) {
        RedHolder.appendChild(noteContainer);
      } else {
        pinnRed.appendChild(noteContainer);
      }
    } else if (childData.color == "Green") {
      noteContainer.className = "note-container-green";
      if (childData.pinned == false) {
        GreenHolder.appendChild(noteContainer);
      } else {
        pinnGreen.appendChild(noteContainer);
      }
    } else if (childData.color == "Blue") {
      noteContainer.className = "note-container-blue";
      if (childData.pinned == false) {
        BlueHolder.appendChild(noteContainer);
      } else {
        pinnBlue.appendChild(noteContainer);
      }
    }

    noteTitle.className = "note-title";
    noteContent.className = "note-content";
    date.className = "data";
    button.className = "btn btn-outline-light btn-sm remove-btn";
    pinn.className = "btn btn-sm pinn-btn";

    noteContainer.appendChild(pinn);
    noteContainer.appendChild(noteTitle);
    noteContainer.appendChild(noteContent);
    noteContainer.appendChild(date);
    noteContainer.appendChild(button);
    pinn.appendChild(pinnImg);

    noteTitle.innerHTML = childData.title;
    noteContent.innerHTML = childData.description;
    date.innerHTML = childData.created;
    button.innerHTML = "Remove"
    labelPinn.innerHTML = "Pinn"
    pinnImg.src = "img/pinned.png";

    if (childData.pinned == true) {
      pinn.style.display = 'none';
    } else {
      pinn.style.display = 'block';
    }



    button.addEventListener('click', (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute('data-id');
      var elementRef = firebase.database().ref("Nots/" + id);
      elementRef.remove();
    })

    pinn.addEventListener('click', (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.parentElement.getAttribute('data-id');
      firebase.database().ref("Nots/" + id).update({
        pinned: true
      })
    })
  });
}) 
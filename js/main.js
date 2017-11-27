'use strict';

var moving = true;
var created = false;
var raycaster = new THREE.Raycaster();
var information;

// --- SCENE CONFIGURATION ---
var scene = new THREE.Scene();

var width = window.innerWidth,
    height = window.innerHeight;

var aspect = width / height;
var camera = new THREE.OrthographicCamera(-3, 3, 6 / (2 * aspect), 6 / (-2 * aspect), 1, 10000);
//camera.zoom = 0.9;
camera.updateProjectionMatrix();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

document.getElementById("container").appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff));
var light = new THREE.DirectionalLight(0xffffff, 0.1);
light.position.set(5, 3, 5);
scene.add(light);
var texloader = new THREE.TextureLoader();

var radius = 1.4;
var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshPhongMaterial({
        map: texloader.load("images/earth_atmos_2048.jpg"),
        bumpMap: texloader.load("images/earthbump.jpg"),
        bumpScale: 0.05,
        specularMap: texloader.load("images/earthspec.jpg"),
        shading: THREE.SmoothShading
    })
);

var clouds = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshPhongMaterial({
        map: texloader.load("images/clouds.jpg"),
        side: THREE.DoubleSide,
        opacity: 0.2,
        transparent: true,
        depthWrite: false
    })
);



// --- EVENT LISTENERS ---

function switch_presentation() {
    for (var i in globe.children) {
        if (globe.children[i].name != "") {
            globe.children[i].visible = false;
        }
    }

    for (var i in globe.children) {
        for (var j in information) {
            if (globe.children[i].sec_id == information[j].id && globe.children[i].name == document.getElementById("presentation_mode").value) {
                globe.children[i].visible = true;
            }
        }
    }
    console.log(document.getElementById("presentation_mode").nodeValue);
}



window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    var aspect = window.innerWidth / window.innerHeight;
    camera.top = 6 / (2 * aspect);
    camera.bottom = 6 / (-2 * aspect);
    camera.updateProjectionMatrix();
});

window.addEventListener('mousedown', onDocumentMouseDown, false);


function onDocumentMouseDown(e) {
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector3();

    mouseVector.x = 2 * (e.clientX / width) - 1;
    mouseVector.y = 1 - 2 * (e.clientY / height);

    raycaster.setFromCamera(mouseVector, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length) {
        // intersections are, by default, ordered by distance,
        // so we only care for the first one. The intersection
        // object holds the intersection point, the face that's
        // been "hit" by the ray, and the object to which that
        // face belongs. We only care for the object itself.
        var target = intersects[0].object;
        if (target.name == 'pin' || target.name == 'bola') {
            swal({
                title: "Informações",
                text: "Pescado em: " + target.data +
                    " ás " + target.hora +
                    "\nPelo Barco: " + target.sec_id +
                    "\nNa região: " + target.latitude + "º " + target.longitude + "º" +
                    "\n\nPeso do Pescado: " + target.pesoKg + " Kg" +
                    "\nVelocidade: " + target.velocidade,
                imageUrl: "images/fishing_icon.png",
                confirmButtonText: "Fechar",
                allowOutsideClick: "true"
            });
        }
    }
}

window.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(e) {
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector3();

    mouseVector.x = 2 * (e.clientX / width) - 1;
    mouseVector.y = 1 - 2 * (e.clientY / height);

    raycaster.setFromCamera(mouseVector, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length) {
        // intersections are, by default, ordered by distance,
        // so we only care for the first one. The intersection
        // object holds the intersection point, the face that's
        // been "hit" by the ray, and the object to which that
        // face belongs. We only care for the object itself.
        var target = intersects[0].object;
        if (target.name == 'pin') {
            for (var i in globe.children) {
                if (globe.children[i].name == 'pin') {
                    globe.children[i].scale.set(0.1, 0.1, 0.2);
                }
            }
            target.scale.set(0.2, 0.2, 0.4);
        } else if (target.name == 'bola') {
            for (var i in globe.children) {
                if (globe.children[i].name == 'bola') {
                    globe.children[i].material.color.setHex(0xffff00);
                }
            }
            target.material.color.setHex(0xff0000)
        }
        else {
            for (var i in globe.children) {
                if (globe.children[i].name == 'pin') {
                    globe.children[i].scale.set(0.1, 0.1, 0.2);
                }
                if (globe.children[i].name == 'bola') {
                    globe.children[i].material.color.setHex(0xffff00);
                }
            }
        }
    }
}

clouds.rotation.y = Math.PI;
sphere.rotation.y = Math.PI;
sphere.add(clouds);
var globe = new THREE.Object3D();
globe.name = 'globe';
globe.add(sphere);
camera.position.z = 5;
var pins = new THREE.Object3D();
scene.add(globe);
// -/- SCENE CONFIGURATION -/-


// --- PIN FUNCTIONS ---
var render = function () {
    requestAnimationFrame(render);
    controls.update();
    if (moving) {
        // a rotação não estava ao contrário?
        globe.rotation.y += 0.0005;
    }
    renderer.render(scene, camera);
}

function createLocals(info) {
    information = info;

    for (var i in globe.children) {
        if (globe.children[i].name != "") {
            globe.children[i].visible = false;
        }
    }

    for (var i in globe.children) {
        for (var j in info) {
            if (globe.children[i].sec_id == info[j].id) {
                globe.children[i].visible = true;
            }
        }
    }

    if (!created) {
        for (var i in info) {
            createLocal(info[i]);
        }
        render();
    }

    created = true

}

function createLocal(info) {

    console.log(info)

    //Esfera
    var geometry = new THREE.SphereBufferGeometry(Math.log10(info.weight) * .02, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: info.speed });
    var bola = new THREE.Mesh(geometry, material);
    bola.transparent = true
    bola.name = 'bola'
    bola.sec_id = info.id
    bola.pesoKg = info.weight;
    bola.velocidade = info.speed;
    bola.data = info.date;
    bola.hora = info.hour;
    bola.latitude = info.latitude;
    bola.longitude = info.longitude;

    //pin
    var pin = texloader.load('images/green_fish_marker.png');

    var marker = new THREE.SpriteMaterial({
        map: pin
    });
    var sprite = new THREE.Sprite(marker);
    sprite.name = 'pin';

    sprite.sec_id = info.id
    sprite.pesoKg = info.weight;
    sprite.velocidade = info.speed;
    sprite.data = info.date;
    sprite.hora = info.hour;
    sprite.latitude = info.latitude;
    sprite.longitude = info.longitude;

    var position = convertCoordinates(info.latitude.replace(",", "."), info.longitude.replace(",", "."));
    var position2 = convertCoordinates2(info.latitude.replace(",", "."), info.longitude.replace(",", "."));

    //set esfera
    bola.position.set(position.x, position.y, position.z);

    //set pin
    sprite.position.set(position2.x, position2.y, position2.z);
    sprite.scale.set(0.1, 0.1, 0.2);
    globe.add(sprite);
    sprite.visible = false;


    globe.add(bola);
}

function convertCoordinates(lat, lon) {

    var phi = (90 - lat) * (Math.PI / 180);
    var theta = (lon + 180) * (Math.PI / 180);

    var x = -((radius) * Math.sin(phi) * Math.cos(theta));
    var z = ((radius) * Math.sin(phi) * Math.sin(theta));
    var y = ((radius) * Math.cos(phi));

    return new THREE.Vector3(x, y, z);
}

function convertCoordinates2(lat, lon) {

    var phi = (90 - lat) * (Math.PI / 180);
    var theta = (lon + 180) * (Math.PI / 180);

    var x = -((radius + 0.05) * Math.sin(phi) * Math.cos(theta));
    var z = ((radius + 0.05) * Math.sin(phi) * Math.sin(theta));
    var y = ((radius + 0.05) * Math.cos(phi));

    return new THREE.Vector3(x, y, z);
}


// --- EXECUTION ---
$(window).load(function () {
    $("canvas").css("visibility", "visible");
    $("#title").css("visibility", "visible");
    filterSearch()
});

render();

// Pegando o canvas do HTML
var canvas = document.getElementById("renderCanvas");

// Carregando a Engine do Babylon
var engine = new BABYLON.Engine(canvas, true);

// Função que inicializa a cena
var createScene = function () {

    // Criando uma cena básica do Babylon
    var scene = new BABYLON.Scene(engine);

    // Setando a cor do plano de fundo para cinza claro
    scene.clearColor = new BABYLON.Color3(135/255, 206/255, 235/255);

    // Criando e posicionando a camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 30, BABYLON.Vector3.Zero(), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);

    // // Cria uma luz hemisférica
    // var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    // light.intensity = 0.2;

    // --------------------------
    // Adiciona a textura de fundo HDR
    // --------------------------
    // Certifique-se de que o arquivo "textures/sky.hdr" esteja disponível no caminho informado.
    var hdrTexture = new BABYLON.HDRCubeTexture("textures/empty_play_room_4k.hdr", scene, 1024);
    scene.environmentTexture = hdrTexture;
    // Cria um skybox padrão utilizando a textura HDR (o parâmetro "true" indica que o skybox será infinito)
    scene.createDefaultSkybox(hdrTexture, true, 1000);
    // --------------------------
    // Fim da adição da textura HDR
    // --------------------------

    var dimensions = 4;
    var expander = 3;
    camera.lowerBetaLimit = 0.1;                // Evita olhar diretamente para cima
    camera.upperBetaLimit = Math.PI / 2 - 0.1;

    // Cria a grade de cubos
    for (var x = 1; x <= dimensions; x++) {
        for (var y = 1; y <= dimensions; y++) {
            for (var z = 1; z <= dimensions; z++) {
                var box = BABYLON.Mesh.CreateBox("box-" + x + y + z, 1.0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
                box.position.x = x * expander - (dimensions * 2);
                box.position.y = y * expander - (dimensions * 2);
                box.position.z = z * expander - (dimensions * 2);
                var material = new BABYLON.StandardMaterial("material-" + x + y + z, scene);
                material.alpha = 0.5;
                material.diffuseColor = new BABYLON.Color3(170 / 255, 170 / 255, 170 / 255);
                box.material = material;
            }
        }
    }

    // --------------------------
    // Criação da Mesa de Madeira
    // --------------------------

    // Cria o material com textura de madeira -> textures/wood.jpg
    var woodMaterial = new BABYLON.StandardMaterial("woodMaterial", scene);
    woodMaterial.diffuseTexture = new BABYLON.Texture("textures/Wood066_1K-JPG_Color.jpg", scene);
    woodMaterial.normalTexture = new BABYLON.Texture("textures/Wood066_1K-JPG_NormalGL.jpg", scene);
    woodMaterial.metallicTexture = new BABYLON.Texture("textures/Wood066_1K-JPG_Roughness.jpg", scene); 
    woodMaterial.ambientTexture = new BABYLON.Texture("textures/Wood066_1K-JPG_Displacement.jpg", scene);
    


    // Setando dimensões para o tampo da mesa
    var tableTopWidth = 15;
    var tableTopDepth = 15;
    var tableTopThickness = 0.3;

    // Cria a parte de cima da mesa
    var tableTop = BABYLON.MeshBuilder.CreateBox("tableTop", {
        width: tableTopWidth,
        depth: tableTopDepth,
        height: tableTopThickness
    }, scene);
    tableTop.material = woodMaterial;

    // Posiciona a parte de cima da mesa abaixo dos cubos.
    // Como os cubos variam de y = -5 a y = 4, definimos em y = -6
    tableTop.position = new BABYLON.Vector3(-0.5, -6, -0.5);

    // Dimensões e posições para as pernas da mesa
    var legHeight = 6;
    var legThickness = 0.3;

    // Calcula o deslocamento a partir do centro do tampo para posicionar as pernas nos cantos
    var offsetX = tableTopWidth / 2 - legThickness / 2;
    var offsetZ = tableTopDepth / 2 - legThickness / 2;

    // Define as posições relativas das quatro pernas
    var legPositions = [
        new BABYLON.Vector3( offsetX, -legHeight / 2 - tableTopThickness / 2,  offsetZ),
        new BABYLON.Vector3(-offsetX, -legHeight / 2 - tableTopThickness / 2,  offsetZ),
        new BABYLON.Vector3( offsetX, -legHeight / 2 - tableTopThickness / 2, -offsetZ),
        new BABYLON.Vector3(-offsetX, -legHeight / 2 - tableTopThickness / 2, -offsetZ)
    ];

    // Cria e posiciona cada perna
    for (var i = 0; i < legPositions.length; i++) {
        var leg = BABYLON.MeshBuilder.CreateBox("tableLeg" + i, {
            width: legThickness,
            depth: legThickness,
            height: legHeight
        }, scene);
        leg.material = woodMaterial;
        leg.position = tableTop.position.add(legPositions[i]);
    }


    // Configura luz adicional
    var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(1.5, 1, 1.6), scene);
    light0.intensity = 1;
    light0.diffuse = new BABYLON.Color3(1, 1, 1);
    light0.specular = new BABYLON.Color3(1, 1, 1);
    light0.groundColor = new BABYLON.Color3(0, 0, 0);

    var light2 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-2.5, 1, 2.5), scene);
    light2.diffuse = new BABYLON.Color3(1, 1, 1);
    light2.specular = new BABYLON.Color3(1, 1, 1);
    light2.groundColor = new BABYLON.Color3(0, 0, 0);


    return scene;
};

// Cria a cena
var scene = createScene();

// Loop de renderização
engine.runRenderLoop(function () {

    // Efeito hover para os cubos: reseta a transparência e destaca o mesh sob o ponteiro
    for (var i = 0; i < scene.meshes.length; i++) {
        var mesh = scene.meshes[i];

        // Verifica se o nome do mesh contém índices (ex.: "box-123")
        if (mesh.name.indexOf("box-") === 0) {
            var indexesString = mesh.name.split('-').pop();
            var x = indexesString[0];
            var y = indexesString[1];
            var z = indexesString[2];

            // Se o valor não estiver setado, reseta a transparência
            if (!megaFour.valueIsSet(x, y, z)) {
                mesh.material.alpha = 0.5;
            }
        }
    }
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pickResult.hit) {
        pickResult.pickedMesh.material.alpha = 1;
    }
    scene.render();
});

// Ajusta o canvas se o tamanho da janela mudar
window.addEventListener("resize", function () {
    engine.resize();
});

var aux = false;

// Criando a luz uma única vez
var light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(0, 1, 0), scene);
light3.intensity = 0.8;
light3.diffuse = new BABYLON.Color3(1, 1, 0); // Azul inicial

//Evento de clique do mouse
window.addEventListener("click", function () {
    
    // Quando um objeto é selecionado
    var pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pickResult.hit) {
        var name = pickResult.pickedMesh.name;
        var indexesString = name.split('-').pop();
        var x = indexesString[0];
        var y = indexesString[1];
        var z = indexesString[2];
        megaFour.action(x, y, z, pickResult);
        if (!aux) {
            aux = true;
            light3.diffuse = new BABYLON.Color3(0, 0, 1); // Azul
        } else {
            aux = false;
            light3.diffuse = new BABYLON.Color3(1, 1, 0); // Vermelho
        }
    }
});

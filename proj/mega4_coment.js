var megaFour = function () {
    var self = this;
    this.dimensions = 4;
    this.values = [];
    this.activePlayer = 1;
    this.$activePlayer = $('#activePlayer');
    this.initValues = function () {
        for (var x = 1; x <= self.dimensions; x++) {
            self.values[x] = [];
            for (var y = 1; y <= self.dimensions; y++) {
                self.values[x][y] = [];
                for (var z = 1; z <= self.dimensions; z++) {
                    self.values[x][y][z] = {
                        player: 0,
                        value: false
                    }
                }
            }
        }
    };

    this.clearValues = function () {
        // Resetar os valores do jogo no objeto megaFour
        for (var x = 1; x <= self.dimensions; x++) {
            for (var y = 1; y <= self.dimensions; y++) {
                for (var z = 1; z <= self.dimensions; z++) {
                    self.values[x][y][z] = {
                        player: 0,
                        value: false
                    };
                }
            }
        }
    
        // Criar uma lista de esferas para substituição
        let spheresToReplace = [];
    
        // Identificar todas as esferas na cena
        scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith("sphere-")) {
                spheresToReplace.push(mesh);
            }
        });
    
        // Substituir cada esfera por um novo cubo
        spheresToReplace.forEach(sphere => {
            let position = sphere.position.clone(); // Guardar a posição da esfera
            let nameParts = sphere.name.split('-'); // Pegar os índices X, Y, Z do nome da esfera
            let x = parseInt(nameParts[1]);
            let y = parseInt(nameParts[2]);
            let z = parseInt(nameParts[3]);
    
            // Criar um novo cubo na posição da esfera
            let box = BABYLON.Mesh.CreateBox("box-" + x + y + z, 1.0, scene);
            box.position = position;
    
            // Criar e aplicar um novo material ao cubo
            let material = new BABYLON.StandardMaterial("material-" + x + y + z, scene);
            material.alpha = 0.5;
            material.diffuseColor = new BABYLON.Color3(170 / 255, 170 / 255, 170 / 255);
            box.material = material;
    
            // Remover a esfera antiga
            sphere.dispose();
        });
    
        // Resetar os cubos restantes
        scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith("box-")) {
                if (mesh.material) {
                    mesh.material.alpha = 0.5; // Voltar para transparência original
                    mesh.material.diffuseColor = new BABYLON.Color3(170 / 255, 170 / 255, 170 / 255);
                }
            }
        });
    }       
    this.check = function () {
        //checar x
        for (var y = 1; y <= self.dimensions; y++) {
            for (var z = 1; z <= self.dimensions; z++) {
                if (
                    self.values[1][y][z].value == true && self.values[1][y][z].player == self.activePlayer &&
                        self.values[2][y][z].value == true && self.values[2][y][z].player == self.activePlayer &&
                        self.values[3][y][z].value == true && self.values[3][y][z].player == self.activePlayer &&
                        self.values[4][y][z].value == true && self.values[4][y][z].player == self.activePlayer
                    ) {
                    self.win();
                }
            }
        }
        //checar y
        for (var x = 1; x <= self.dimensions; x++) {
            for (var z = 1; z <= self.dimensions; z++) {
                if (
                    self.values[x][1][z].value == true && self.values[x][1][z].player == self.activePlayer &&
                        self.values[x][2][z].value == true && self.values[x][2][z].player == self.activePlayer &&
                        self.values[x][3][z].value == true && self.values[x][3][z].player == self.activePlayer &&
                        self.values[x][4][z].value == true && self.values[x][4][z].player == self.activePlayer
                    ) {
                    self.win();
                }
            }
        }
        //checar z
        for (var x = 1; x <= self.dimensions; x++) {
            for (var y = 1; y <= self.dimensions; y++) {
                if (
                    self.values[x][y][1].value == true && self.values[x][y][1].player == self.activePlayer &&
                        self.values[x][y][2].value == true && self.values[x][y][2].player == self.activePlayer &&
                        self.values[x][y][3].value == true && self.values[x][y][3].player == self.activePlayer &&
                        self.values[x][y][4].value == true && self.values[x][y][4].player == self.activePlayer
                    ) {
                    self.win();
                }
            }
        }
        //chear z/x
        for (var y = 1; y <= self.dimensions; y++) {
            if (
                self.values[1][y][1].value == true && self.values[1][y][1].player == self.activePlayer &&
                    self.values[2][y][2].value == true && self.values[2][y][2].player == self.activePlayer &&
                    self.values[3][y][3].value == true && self.values[3][y][3].player == self.activePlayer &&
                    self.values[4][y][4].value == true && self.values[4][y][4].player == self.activePlayer
                    ||
                    self.values[1][y][4].value == true && self.values[1][y][4].player == self.activePlayer &&
                        self.values[2][y][3].value == true && self.values[2][y][3].player == self.activePlayer &&
                        self.values[3][y][2].value == true && self.values[3][y][2].player == self.activePlayer &&
                        self.values[4][y][1].value == true && self.values[4][y][1].player == self.activePlayer
                ) {
                self.win();
            }
        }
        //checar y/x
        for (var z = 1; z <= self.dimensions; z++) {
            if (
                self.values[1][1][z].value == true && self.values[1][1][z].player == self.activePlayer &&
                    self.values[2][2][z].value == true && self.values[2][2][z].player == self.activePlayer &&
                    self.values[3][3][z].value == true && self.values[3][3][z].player == self.activePlayer &&
                    self.values[4][4][z].value == true && self.values[4][4][z].player == self.activePlayer
                    ||
                    self.values[1][4][z].value == true && self.values[1][4][z].player == self.activePlayer &&
                        self.values[2][3][z].value == true && self.values[2][3][z].player == self.activePlayer &&
                        self.values[3][2][z].value == true && self.values[3][2][z].player == self.activePlayer &&
                        self.values[4][1][z].value == true && self.values[4][1][z].player == self.activePlayer
                ) {
                self.win();
            }
        }
        //checar y/z
        for (var x = 1; x <= self.dimensions; x++) {
            if (
                self.values[x][1][1].value == true && self.values[x][1][1].player == self.activePlayer &&
                    self.values[x][2][2].value == true && self.values[x][2][2].player == self.activePlayer &&
                    self.values[x][3][3].value == true && self.values[x][3][3].player == self.activePlayer &&
                    self.values[x][4][4].value == true && self.values[x][4][4].player == self.activePlayer
                    ||
                    self.values[x][1][4].value == true && self.values[x][1][4].player == self.activePlayer &&
                        self.values[x][2][3].value == true && self.values[x][2][3].player == self.activePlayer &&
                        self.values[x][3][2].value == true && self.values[x][3][2].player == self.activePlayer &&
                        self.values[x][4][1].value == true && self.values[x][4][1].player == self.activePlayer
                ) {
                self.win();
            }
        }
        //checar x/y/z
        if (
            self.values[1][1][1].value == true && self.values[1][1][1].player == self.activePlayer &&
                self.values[2][2][2].value == true && self.values[2][2][2].player == self.activePlayer &&
                self.values[3][3][3].value == true && self.values[3][3][3].player == self.activePlayer &&
                self.values[4][4][4].value == true && self.values[4][4][4].player == self.activePlayer
            ) {
            self.win();
        }
        if (
            self.values[1][4][4].value == true && self.values[1][4][4].player == self.activePlayer &&
                self.values[2][3][3].value == true && self.values[2][3][3].player == self.activePlayer &&
                self.values[3][2][2].value == true && self.values[3][2][2].player == self.activePlayer &&
                self.values[4][1][1].value == true && self.values[4][1][1].player == self.activePlayer
            ) {
            self.win();
        }
        if (
            self.values[4][4][1].value == true && self.values[4][4][1].player == self.activePlayer &&
                self.values[3][3][2].value == true && self.values[3][3][2].player == self.activePlayer &&
                self.values[2][2][3].value == true && self.values[2][2][3].player == self.activePlayer &&
                self.values[1][1][4].value == true && self.values[1][1][4].player == self.activePlayer
            ) {
            self.win();
        }
        if (
            self.values[4][1][4].value == true && self.values[4][1][4].player == self.activePlayer &&
                self.values[3][2][3].value == true && self.values[3][2][3].player == self.activePlayer &&
                self.values[2][3][2].value == true && self.values[2][3][2].player == self.activePlayer &&
                self.values[1][4][1].value == true && self.values[1][4][1].player == self.activePlayer
            ) {
            self.win();
        }
    }
    this.win = function () {
        var current = $('#winsPlayer' + self.activePlayer).html();
        $('#winsPlayer' + self.activePlayer).html(++current);
        alert('Player ' + self.activePlayer + ' venceu!');
        self.clearValues();
    }
    this.valueFactory = function (player, value) {
        return {
            player: player,
            value: value
        }
    }
    this.switchPlayer = function () {
        if (self.activePlayer == 1) {
            self.activePlayer = 2;
        } else {
            self.activePlayer = 1;
        }
        self.$activePlayer.html(self.activePlayer);
    }

    this.action = function (x, y, z, obj) {
        // Checar se o campo já foi setado
        if (!self.valueIsSet(x, y, z)) {
            var oldBox = obj.pickedMesh;
            
            // Criar uma nova esfera no lugar do cubo
            var sphere = BABYLON.Mesh.CreateSphere("sphere-" + x + y + z, 16, 1.0, scene);
            sphere.position = oldBox.position; // Mantém a posição do cubo
            
            // Aplicar o mesmo material do cubo à esfera
            sphere.material = new BABYLON.StandardMaterial("material-" + x + y + z, scene);
            sphere.material.diffuseColor = oldBox.material.diffuseColor;
            sphere.material.alpha = 1;
            
            // Remover o cubo da cena
            oldBox.dispose();
            
            self.setColor(obj.pickedMesh.material.diffuseColor);
            self.values[x][y][z] = self.valueFactory(self.activePlayer, true);
            self.check();
            self.switchPlayer();
        } else {
            alert("Esse já foi escolhido");
        }
    }
    this.setColor = function (colorObj) {
        if (self.activePlayer == 1) {
            colorObj.r = 255 / 255;
            colorObj.g = 204 / 255;
            colorObj.b = 51 / 255
        } else {
            colorObj.r = 51 / 255;
            colorObj.g = 102 / 255;
            colorObj.b = 255 / 255
        }
    }
    this.valueIsSet = function (x, y, z) {
        var valueObj = self.values[x][y][z];
        if (valueObj.value == true) {
            return true;
        } else {
            return false;
        }
    }
    this.initValues();
};
var megaFour = new megaFour();

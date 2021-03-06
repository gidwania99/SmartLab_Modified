
mainPreorder('sim');
document.getElementById("isdiv").style.display="block";

window.onresize = () => {
    if (window.innerWidth < 1300)
        drawBinaryTree(root, canvas);
}

var hint1: HTMLSpanElement = <HTMLSpanElement>document.getElementById("hint1");
var hint2: HTMLSpanElement = <HTMLSpanElement>document.getElementById("hint2");
var hint3: HTMLSpanElement = <HTMLSpanElement>document.getElementById("hint3");
var simulationOrder: HTMLDivElement = <HTMLDivElement>document.getElementById("simulationOrder")

var retryModal: HTMLButtonElement = <HTMLButtonElement>document.getElementById('retryModal');
var learnModal: HTMLButtonElement = <HTMLButtonElement>document.getElementById('learnModal');
var testModal: HTMLButtonElement = <HTMLButtonElement>document.getElementById('testModal');



var falseCount: number = 0;
var counter: number = 0;

var userAnsList: BinarySearchTreeNode[] = [];

sim_min = min
sim_sec = sec

canvas.addEventListener('mousedown', function (e) {

    var i: number = 0;
    var [canvasX, canvasY] = canvasComponent.getCursorPosition(e);

    for (i = 0; i < preOrderNodeList.length; i++) {
        if (!preOrderNodeList[i].isLocked && preOrderNodeList[i].nodeCircle.isinside(canvasX, canvasY)) {
            writeSimulationInstructionsPreorder(preOrderNodeList[i]);
        }
    }

});


function writeInstructionPreorder(message1, message2, err?) {
   
    if (err && err != "done") {
        hint1.innerHTML = "<b style='color:red'>" + message1 + "</b>";
        hint2.innerHTML = "<span>" + message2 + "</span>";
        if (err == true || err == false)
            hint3.innerHTML = "<span>Reselect The Node</span>";
    } else {
        hint1.innerHTML = "<b style='color:green'>" + message1 + "</b>";
        hint2.innerHTML = "<span>" + message2 + "</span>";
        if (err != "done") {
            hint3.innerHTML = "<span>Select Next Node.</span>";
        } else {
            hint3.innerHTML = "";
        }
    }

}


function writeSimulationInstructionsPreorder(node: BinarySearchTreeNode) {


    if (node == preOrderNodeList[counter]) {
     

        if(counter==0)
            writeInstructionPreorder("Correct!", node.value + " is the root node.", false); 
        else if(node.value<node.parent.value){

            if(preOrderNodeList[counter].value < root.value && preOrderNodeList[counter + 1].value > root.value)
            {
            
                    writeInstructionPreorder("Correct!", node.value + " is the left child of "+node.parent.value+"."+"<br>The left subtree of root node " + root.value + " is completed.", false);
              
            }
            else
                writeInstructionPreorder("Correct!", node.value + " is the left child of "+node.parent.value+".", false); 

        }
        else if(node.value>node.parent.value){
            if(preOrderNodeList[counter].value < root.value && preOrderNodeList[counter + 1].value > root.value)
                writeInstructionPreorder("Correct!", node.value + " is the right child of "+node.parent.value+"."+"<br>The left subtree of " + root.value + " is completed.", false);
 
            else
                writeInstructionPreorder("Correct!", node.value + " is the right child of "+node.parent.value+".", false); 

        }
        lockNode(node);
        counter++;

    }
    else    //wrong ans
    {

        if (counter == 0) {
            writeInstructionPreorder("Incorrect", "Traverse the root node first!!", true);
            highlightNode(root);

        }
        else {
            if (preOrderNodeList[counter].value < root.value) {  //left of root is not completed{

                if (node.value > root.value) { //user select node from right tree
                    writeInstructionPreorder("Incorrect", "Traverse the left subtree of " + root.value + " first!!", true);
                    drawLeftSubtreeInstruction(root);
                }
                else {
                    if (preOrderNodeList[counter].value > preOrderNodeList[counter].parent.value)
                        writeInstructionPreorder("Incorrect", "Traverse the right child of " + preOrderNodeList[counter].parent.value + " first!!", true);
                    else
                        writeInstructionPreorder("Incorrect", "Traverse the left child of " + preOrderNodeList[counter - 1].value + " first!!", true);
                    highlightNode(preOrderNodeList[counter]);
                }

            }
            else {   //left root is Traversed

                if (preOrderNodeList[counter - 1].value < root.value)
                    writeInstructionPreorder("Incorrect", "Traverse the right child of " + root.value + " first!!", true);
                else {
                    if (preOrderNodeList[counter].value < preOrderNodeList[counter].parent.value)
                        writeInstructionPreorder("Incorrect", "Traverse the left child of " + preOrderNodeList[counter - 1].value + " first!!", true);
                    else
                        writeInstructionPreorder("Incorrect", "Traverse the right child of " + preOrderNodeList[counter].parent.value + " first!!", true);

                }
                highlightNode(preOrderNodeList[counter]);
            }

        }

        setTimeout(() => {
           
            drawBinaryTree(root, canvas);
        }, 3000);
        falseCount++;
        if (falseCount == 3) {
            redirecting();
        }
        chanceCount.innerHTML = (3 - falseCount) + "";

        chooseWrongNode(node);

    }
    if (preOrderNodeList.length == counter) {
        writeInstructionPreorder("Congratulations", "You have Completed preorder traversal.", "done")
        redirecting(true);
    }
}


learnModal.onclick = function () {
  
    removeModal();
    window.location.href = "PreOrderDemo.html"
}
testModal.onclick = function () {
    removeModal();
   
    window.location.href = "PreOrderTest.html"

}

retryModal.onclick = function () {
 removeModal();
    // removeModal();
    stopConfettiInner();
    hint1.innerHTML = "<span>Click on Node to Start PreOrder Simulation</span>";
    hint2.innerHTML = "<span></span>";
    hint3.innerHTML = "<span></span>";
    simulationOrder.innerHTML = "Selected Nodes:";
    falseCount = 0;
    counter = 0;
    chanceCount.innerHTML = (3 - falseCount) + "";
    if (retryModal.value == "new") {
        mainPreorder('sim');

    }
    else {
        freeListNode(preOrderNodeList);
        drawBinaryTree(root, canvas);
    }

}

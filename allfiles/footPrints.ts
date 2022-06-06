var graphCanvas : HTMLCanvasElement =<HTMLCanvasElement> document.getElementById("chart_canvas")
// var graphCtx 

var chartContainer : HTMLDivElement = <HTMLDivElement>document.getElementById("chartContainer");
window.onload = () =>{
    graphCanvas.style.height = "80%";
    graphCanvas.style.width = "65%";

}
$.ajax({
    type: 'POST',
    headers:{
        'Content-type': 'application/json',
        'Accept': 'application/json'
    },
    url: 'http://127.0.0.1:5000/getFootPrints',
    crossDomain: true,
    success: function(response){
        console.log(response)
        drawGraph(response)
    }
});

function drawGraph(data){
    var xValues=[]
        var yValues=[]
        var barColors = [
            "#b91d47",
            "#00aba9",
            "#2b5797",
            "#e8c3b9",
            "#1e7145"
          ];
        for(var i = 0 ; i < data.length ; i++){
            xValues[i] = data[i]['_id']
            yValues[i] = data[i]['sum_min']
        }
        new Chart('chart_canvas',{
            type: 'pie',
            data:{
                labels: xValues,
                datasets:[{
                    backgroundColor: barColors,
                    data: yValues
                }]
            }
        });

}
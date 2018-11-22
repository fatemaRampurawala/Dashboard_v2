var returnedJson = '';
var charttype = 'column';
var Title = '';
var KPI_ID = '';
var KPI_Name = '';
var Filters;                  // This will hold name of filters of a given KPI
var SelectedFilters;         //This will hold current selection of filters in name value pair
var Measures;
var Dimensions;
var Xaxis, Series = [];
var Chart;
var SeriesBkp;
var DataTable = [];

function GetTime() {
    var d = new Date();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var ms = d.getMilliseconds();
    return (s + ":" + ms);
}

$(document).ready(function () {
    //$(".DefaultKPI").click();
   RenderSideMenu(true);
    //$("#container img").hide();
    
    $(".ChartType").click(function (event) {                    //Chart Type Change
        //PopulateSelectedFilters('FilterContainer',KPI_ID);
        charttype = $(this).children("input").val();
        ChangeChartType();

    });

    $(".select2_multiple").change(function () {                 //Filter Selection change

        PopulateSelectedFilters('FilterContainer', KPI_ID);

    });

    $("[name=Refresh]").click(function () {                     //Refresh button
        PopulateSelectedFilters('FilterContainer', KPI_ID);
        $("[name='Cumulative']").removeClass("active");
        $("[name=Refresh]").removeClass("active");
        console.log($(this));

    });
    
    $("#3").click(function () {                                 //Filter button
        $(this).removeClass("active");
    });

    $("[name='Cumulative']").click(function () {                // CUMULATIVE BUTTON
        if (!($(this).children("input").is(':checked'))) {

            $(this).children("input").checked = true;
            SeriesBkp = [];
            Series.forEach(function (item, index) {
                SeriesBkp[index] = {};
                SeriesBkp[index].name = item.name;
                SeriesBkp[index].data = item.data.slice()
            });
            
            var Cumulative = Series.slice(0);
            var temp = [];
            for (var i = 0; i < Cumulative.length; i++)
            {

                Cumulative[i].data.reduce((prev, curr, index) => temp[index] = prev + curr, 0)
                Cumulative[i].data = temp;
                temp = [];
            }
            Chart.series.forEach(function (item, index) {
                Chart.series[index].setData(Cumulative[index].data);
            });
            //Chart.series.setData(Cumulative,true);
            
        } else {
            $(this).children("input").checked = false;
            Series = SeriesBkp.slice();
            Chart.series.forEach(function (item, index) {
                Chart.series[index].setData(SeriesBkp[index].data);
            });
        }
    });
    
            $('#chartModel').on('hidden.bs.modal', function () {
                  $('.filter_btn').removeClass('active');
            })
 
            $('.refresh_btn').click(function(){
 
                setTimeout(function () {
                        $('.refresh_btn').removeClass('active');
                },1000)
                
            });
        
    
    //loadDefaultKPI();
});





function AssociatecheckboxEvent() {

    $(".select2_multiple").change(function () {
        console.log("changing filters");
        PopulateSelectedFilters('FilterContainer', KPI_ID);
        PopulateFilterArea('FilterContainer','FilterArea');

    });

}

function AssociatefilterEvent(FilterContainer,FilterArea){
    $(".fa-times").click(function(){
        console.log($(this).parent());
        var filtername = $(this).parent().attr("name");
        var filterVal = $(this).parent().text();
        console.log(filterVal);
        console.log(filtername);
        $(this).parent().remove();

        $(".Filter[name='"+filtername+"'][aria-label='"+filterVal+"']").prop("selected",false);
        PopulateSelectedFilters('FilterContainer', KPI_ID);
    });
}


function RenderPlotLine(Caption,Color,Value){
    
    var Plotline = {};
    Plotline.value = Value;
    Plotline.color = Color;
    Plotline.dashStyle = 'shortdash';
    Plotline.width = 2;
    Plotline.label = {};
    Plotline.label.style = {};
    Plotline.label.style.fontWeight = 'bold';
    Plotline.label.x = -130;
    Plotline.label.text = Caption;
    //Plotline.label.align = 'right';
    //Plotline.zIndex = 20;
    //Plotting 
/*    Chart.yAxis[0].update({              //This is alternate way to plot lines
  	plotLines: Plotline
  });  */ 
    
    Chart.yAxis[0].addPlotLine(Plotline);
}


function PopulateFilterArea(FilterContainer,FilterArea)
{
    $("#"+FilterArea).html('');
    AssociatefilterEvent();
    FilterAreaContent = '';
    Dimensions.forEach(function(item,index){
        FilterAreaContent = FilterAreaContent + `<div class="row selected_filter_row">
							<div class="col-md-12">
								<div class="selectedFilter_head d-inline">`+item[1]+`</div> 
								<ul class="selectedFilter_body d-inline">`;
    //getting selected Filter Values
            $('#' + FilterContainer + ' .select2_multiple[name="DIM' + item[0] + '"]').val().forEach(function (Val, i) {       // for each checked filter value

                 FilterAreaContent = FilterAreaContent + 
									`<li name="DIM`+ item[0] +'">'+Val+`<i class="fa fa-times" aria-hidden="true"></i></li>`;
			});						
					FilterAreaContent = FilterAreaContent +	`</ul></div></div>`;
            
    });
    $("#"+FilterArea).html(FilterAreaContent);
    AssociatefilterEvent(FilterContainer,FilterArea);
}

function plotTargetLine(){
    Measures.forEach(function(item,index){
    var palette = ["Red","Blue","Green","Black","Cyan"];
        RenderPlotLine("("+item[4]+")-"+item[1],palette[index],item[4]);
        
    });
    
}

function ChangeChartType(Control) {

    //charttype = Control.children(".ChartTypeVal").text();//$('.active .ChartTypeVal').text();//$('input:radio[name=ChartType]:checked').val();
    console.log(charttype);
    if (charttype == '' && charttype == null)
        charttype = 'column';
    //renderChart(Xaxis, Series, 'container');
    Chart.update({chart: {
                    type: charttype
                 },series : {
        animation: {
            duration: 2000,
            easing: 'easeBounce'
        }
        }});
}

async function RenderFilters(FilterContainer) {
    var KPI = KPI_ID;
    //var data = Dimensions;//GetDimensions(KPI);
    $.ajax({type: "GET", method: "GET", async: false,
        contentType: "application/json", dataType: "json",
        url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getLabels?nq=true&DIM_MEA_FLAG=D&KPI_ID=" + KPI,
        data: {},
        success: function (dimensions) {
             //Dimensions = dimensions;
             data = dimensions; 
            var FilterTitle, DimNum;
            $('#' + FilterContainer).html('<div class="row">');

            data.forEach(function (item, index,Arr) {    //Calling loop for each dimesnion

                DimNum = item[0];
                FilterTitle = item[1];


                $.ajax({type: "GET", method: "GET", async: true,
                    contentType: "application/json", dataType: "json",
                    url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getDimVal?nq=true&KPI_ID=" + KPI + "&dim_name=DIM" + DimNum,
                    data: {}, 
                        ParentIndex : index,
                        success: function (retdata) {
                        var ParentIndex = this.ParentIndex;
                        $('#' + FilterContainer).append((function ()
                        {
                            var FilterCheckBox = '';
                            FilterCheckBox = FilterCheckBox + `<div class="col-md-3">
                                                                            <div class="filter_div">
                                                                            <div class="filter_title">
                                                                                <i class="fa fa-filter" aria-hidden="true"></i>
                                                                                <span><h4>` + Arr[ParentIndex][1] + `</h4></span>
                                                                                <i class="fa fa-sort-desc pull-right" aria-hidden="true"></i>
                                                                            </div>
                                                                            <div class="filter_content">
                                                                                <select class="select2_multiple form-control" name="DIM` + Arr[ParentIndex][0] + `" multiple="multiple">`;
                            for (var i = 0; i < retdata.length; i++) {
                                FilterCheckBox = FilterCheckBox + `<option class="Filter" selected="true" name="DIM` + Arr[ParentIndex][0] + `" aria-label="` + retdata[i] + `">` + retdata[i] + `</option>`;
                            }
                            `</select>
                                                                        </div>
                                                                        </div>
                                                                    </div>`;


                            if ((data.length - 1) == ParentIndex)
                                FilterCheckBox = FilterCheckBox + "</div>"; //Adding last div to close row
                            //console.log(FilterCheckBox);
                            return FilterCheckBox;
                        })());
                                if ((data.length - 1) == ParentIndex){
                                
                                setTimeout(function(){ 
                                    console.log("Calling populateFilterArea");
                                    PopulateFilterArea(FilterContainer,'FilterArea');
                                    AssociatecheckboxEvent();}, 300);
                                }
                    }
                });// Ajax call

            }); // Loop closed for each dimension

            AssociatecheckboxEvent();
            console.log("Filters rendered "+GetTime());
        }//success of dimesnsion
        });
}
;

function AsyncGetMeasures(KPI, Measures) { //Async version of get measures

    $.ajax({type: "GET", method: "GET", async: true,
        contentType: "application/json", dataType: "json",
        url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getLabels?nq=true&DIM_MEA_FLAG=M&KPI_ID=" + KPI,
        data: {},
        success: function (data) {
            Measures = data;

        }
    });


}


function GetMeasures(KPI) { //This function will bring Measures
    //var Measures;
    $.ajax({type: "GET", method: "GET", async: false,
        contentType: "application/json", dataType: "json",
        url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getLabels?nq=true&DIM_MEA_FLAG=M&KPI_ID=" + KPI,
        data: {},
        success: function (data) {
            Measures = data;
        }
    });
    return Measures;
}


function GetDimensions(KPI) { //This function will bring Dimensions
    //var Dimensions;
    $.ajax({type: "GET", method: "GET", async: false,
        contentType: "application/json", dataType: "json",
        url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getLabels?nq=true&DIM_MEA_FLAG=D&KPI_ID=" + KPI,
        data: {},
        success: function (data) {
            Dimensions = data;
        }
    });
    return Dimensions;
}

function GetCategories(FilterContainer, XaxisDIM, Default) { //This will return categories to be plotted on Xaxis
    var FilterArr = [];
    var temp = [];

    XaxisDIM.forEach(function (item, index) { //For each Dimension
        if (Default == "Y") {
            $.ajax({type: "GET", method: "GET", async: false,
                contentType: "application/json", dataType: "json",
                url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getDimVal?nq=true&KPI_ID=" + KPI_ID + "&dim_name=DIM" + item[0],
                data: {}, success: function (retdata) {
                    temp = retdata;
                }

            });
            FilterArr.push(temp.slice());
            temp = [];
        } else {

            //getting selected Filter Values
            $('#' + FilterContainer + ' .select2_multiple[name="DIM' + item[0] + '"]').val().forEach(function (Val, i) {       // for each checked filter value

                temp.push(Val);
            });
            FilterArr.push(temp.slice());
            temp = [];
        }
    });

    return PrepareCategories(FilterArr.slice());
}


function PrepareCategories(Categories) { //This is recursive function for multi dimension and helps to prepare categories for Xaxis
    if (Categories.length == 1)
        return Categories[0];
    var Parent = Categories.shift();
    var Cat = [];
    for (var i = 0; i < Parent.length; i++)
    {
        Cat[i] = {};
        Cat[i].name = Parent[i];
        Cat[i].categories = Categories.length > 1 ? PrepareCategories(Categories.slice()) : Categories[0];
    }
    return Cat;

}

function LoadinDataTable(returnedJson){
                
                returnedJson = returnedJson.reduce((prev, next) => next.map((item, i) =>
                                        (prev[i] || []).concat(next[i])), []); 
                DataTable.push(returnedJson.slice());
}

function LoadDefault(FilterContainer, KPI, Groupby, LegendDim, XAxisDim, Measures, Series) { //This will be called only when KPI is called for the first time

    var QueryString = '';
    DataTable = [];
    var BaseURL = "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getDataP?nq=true&tp=true&grpby=" + Groupby + "&KPI_ID=" + KPI;
    if (LegendDim.length == 0) {

        $.ajax({type: "GET", method: "GET", async: true,
            contentType: "application/json", dataType: "json",
            url: BaseURL,
            data: {},
            success: function (data) {
                
                LoadinDataTable(data.slice()); //This will prepare data to be loaded in table below graph
                
                data.splice(0, XAxisDim.length);


                for (var i = 0; i < Measures.length; i++)
                {
                    var l = Series.length;
                    Series[l] = {};
                    Series[l].name = Measures[i][1];
                    Series[l].data = data.shift();
                }
                
                renderChart(Xaxis, Series, 'container'); //Render Chart
                console.log("Series Rendered "+GetTime());
                plotTargetLine();
                PlotKPIcard();
                PopulateDataTable();
            }
        });//ajax call
    }//if

    else {
        renderChart(Xaxis, Series, 'container'); 
        plotTargetLine();
        
        LegendDim.forEach(function (item, index, arr) { //For each legend

            
            $.ajax({type: "GET", method: "GET", async: true,
                contentType: "application/json", dataType: "json",
                url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getDimVal?nq=true&KPI_ID=" + KPI + "&dim_name=DIM" + item[0],
                parentindex : index,
                length : arr.length,
                data: {}, success: function (retdata) {

                    retdata.forEach(function (Value, Pos) {        // for each legend value

                        QueryString = QueryString + "&DIM" + item[0] + "=" + Value;


                        $.ajax({type: "GET", method: "GET", async: true,
                            contentType: "application/json", dataType: "json",
                            url: BaseURL + QueryString,
                            data: {},
                            success: function (data) {
                                LoadinDataTable(data.slice());
                                
                                data.splice(0, XAxisDim.length);

                                for (var i = 0; i < Measures.length; i++)
                                {
                                    var l = Series.length;
                                    Series[l] = {};
                                    Series[l].name = Measures[i][1] + "-" + Value;
                                    Series[l].data = data.shift();
                                    console.log("Printing Series");
                                    console.log(Series);
                                    Chart.addSeries(Series[l]);
                                    
                                }
                                setTimeout(function(){ 
                                PopulateDataTable();
                                    PlotKPIcard();
                                    }, 300);
                                
                            }
                        });
                        QueryString = ""; //Reseting Query on change of legend
                    }); //checked DIMs which is legend
                    
                }});
        });//Each Legend


        //If there are no legends then above code will not be executed and below one will be executed 

    }//else

    console.log(Series);
}


function GetLegends(FilterContainer, KPI, Groupby, LegendDim, XAxisDim, Measures, Series) {

    var QueryString = '';
    DataTable = [];
    var BaseURL = "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getDataP?nq=true&tp=true&grpby=" + Groupby + "&KPI_ID=" + KPI;
    if (LegendDim.length == 0) {
        $('#' + FilterContainer + ' option:selected').each(function () {  //for each selected Filter value
            QueryString = QueryString + "&" + $(this).attr('name') + "=" + $(this).attr('aria-label');
        });

        $.ajax({type: "GET", method: "GET", async: true,
            contentType: "application/json", dataType: "json",
            url: BaseURL + QueryString,
            data: {},
            success: function (data) {
                LoadinDataTable(data.slice());
                
                data.splice(0, XAxisDim.length);


                for (var i = 0; i < Measures.length; i++)
                {
                    var l = Series.length;
                    Series[l] = {};
                    Series[l].name = Measures[i][1];
                    Series[l].data = data.shift();
                }
                renderChart(Xaxis, Series, 'container'); //Render Chart
                plotTargetLine();
                //PlotKPIcard();
                PopulateDataTable();
            }
        });//ajax call
    }//if

    else {
        renderChart(Xaxis, Series, 'container'); 
        plotTargetLine();
        //PlotKPIcard();
        LegendDim.forEach(function (item, index) { //For each legend
            //getting selected values per legend
            $('#' + FilterContainer + ' option:selected[name="DIM' + item[0] + '"]').each(function () {       // for each checked legend value
                var ChkboxLabel = $(this).attr('aria-label');
                QueryString = QueryString + "&" + $(this).attr('name') + "=" + $(this).attr('aria-label');
                $('#' + FilterContainer + ' option:selected:not([name="DIM' + item[0] + '"])').each(function () {  //for each Filter apart from Legend
                    QueryString = QueryString + "&" + $(this).attr('name') + "=" + $(this).attr('aria-label');
                }); // DIM Filters apart from Legend

                $.ajax({type: "GET", method: "GET", async: true,
                    contentType: "application/json", dataType: "json",
                    url: BaseURL + QueryString,
                    data: {},
                    success: function (data) {
                        LoadinDataTable(data.slice());
                        data.splice(0, XAxisDim.length);


                        for (var i = 0; i < Measures.length; i++)
                        {
                            var l = Series.length;
                            Series[l] = {};
                            Series[l].name = Measures[i][1] + "-" + ChkboxLabel;
                            Series[l].data = data.shift();
                            Chart.addSeries(Series[l]);
                        }
                        PopulateDataTable();
                        //renderChart(Xaxis, Series, 'container');   //Try if this can be done with Redraw
                    }
                });
                QueryString = ""; //Reseting Query on change of legend
            }); //checked DIMs which is legend

        });


        //If there are no legends then above code will not be executed and below one will be executed 

    }

    //return Series;
}

function PrepareGroupByDIMLegend(XAxisDim,LegendDim){       //pass blank arrays of dimensions and legends by reference
    
    var dimcount = Dimensions.length;
    var Groupby = '';
    
    for (var i = 0; i < dimcount; i++)
    {
        if (Dimensions[i][2] == 'X')   //IT means this will go on X Axis for plotting
        {
            XAxisDim.push(Dimensions[i].slice());
            //Groupby = Groupby + "DIM" + (i + 1) + ",";
            Groupby = Groupby + "DIM" + Dimensions[i][0] + ",";
        }
        if (Dimensions[i][2] == 'L') //IT means this will go on Legend for plotting
        {
            LegendDim.push(Dimensions[i].slice());
        }
    }
    Groupby = Groupby.slice(0, -1); //Trimmed last comma
    return Groupby;
    
}



function DefaultPopulateSelectedFilters(FilterContainer) {
    
        Series = []; //Reset Series
        $.ajax({type: "GET", method: "GET", async: true,
        contentType: "application/json", dataType: "json",
        url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getLabels?nq=true&DIM_MEA_FLAG=M&KPI_ID=" + KPI_ID,
        data: {},
        success: function (data) {
            Measures = data;
               $.ajax({type: "GET", method: "GET", async: true,
                contentType: "application/json", dataType: "json",
                url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getLabels?nq=true&DIM_MEA_FLAG=D&KPI_ID=" + KPI_ID,
                data: {},
                success: function (dimension) {
                    Dimensions = dimension;
                    var XAxisDim = [];
                    var LegendDim = [];
                    var Groupby = PrepareGroupByDIMLegend(XAxisDim,LegendDim);
                    Xaxis = GetCategories(FilterContainer, XAxisDim.slice(), 'Y');
                    LoadDefault(FilterContainer, KPI_ID, Groupby, LegendDim, XAxisDim, Measures, Series);
                    
                    
                                } //success of dimensions
                            });
        }//Success of measures
    });
    
}

function PopulateSelectedFilters(FilterContainer, KPI, Default) { //This function is getting chart data and preparing series/categories for rendering

    Series = []; //Reset Series
    if (Default == "Y")
    {
        Measures = GetMeasures(KPI);
        console.log("Measures Received "+GetTime());
        Dimensions = GetDimensions(KPI);
        console.log("Dimension Received "+GetTime());
        GetTime();
    }
    var dimcount = Dimensions.length;
    var Groupby = '';
    var XAxisDim = [];
    var LegendDim = [];
    for (var i = 0; i < dimcount; i++)
    {
        if (Dimensions[i][2] == 'X')   //IT means this will go on X Axis for plotting
        {
            XAxisDim.push(Dimensions[i].slice());
            Groupby = Groupby + "DIM" + (i + 1) + ",";
        }
        if (Dimensions[i][2] == 'L') //IT means this will go on Legend for plotting
        {
            LegendDim.push(Dimensions[i].slice());
        }
    }
    Groupby = Groupby.slice(0, -1); //Trimmed last comma

    
    

    //Prepare X Axis for plotting of categories
    Xaxis = GetCategories(FilterContainer, XAxisDim.slice(), Default);
    console.log("X Axis completed  "+GetTime());

    //Below will get Series Vairable ready for plotting measures on graph  
    //var Series = [];          //This is array of key value pairs [{},{}]
    if (Default == "Y")
        LoadDefault(FilterContainer, KPI, Groupby, LegendDim, XAxisDim, Measures, Series)
    else
        GetLegends(FilterContainer, KPI, Groupby, LegendDim, XAxisDim, Measures, Series);
    
    
    //charttype = $('input:radio[name=ChartType]:checked').val();
    
    //renderChart(Xaxis, Series, 'container');
};

function ArrayDiff(arr) {
    var newA = [];
    for (var i = 1; i < arr.length; i++)  newA.push(arr[i] - arr[i - 1]);
    newA.unshift(0);  //Set inital difference as zero
    return newA;
}

function CalculateDifference(){
    
    var Differences = [];
    Series.forEach(function(item,index){
    Differences[index] = {};
    Differences[index].data = ArrayDiff(item.data.slice()); 
    Differences[index].name = "Difference of "+item.name;
    Differences[index].yAxis = "Difference of "+item.name;
    });
    return Differences;
}

function ShowDifference(){
    
    var Diff = CalculateDifference();
    Diff.forEach(function(item,index){
        
       Chart.addAxis({ // Secondary yAxis
        id: item.yAxis,
        title: {
            text: item.name
        },
        lineWidth: 2,
        opposite: true
                    });
        
        Chart.addSeries(item);
    });
    
}

function RemoveDifference(){
    while(Chart.yAxis.length>1)
        Chart.yAxis[1].remove();
}



function RenderTitle(){
    $.ajax({type: "GET", method: "GET", async: true,
        contentType: "application/json", dataType: "json",
        url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getTitle?nq=true&KPI_ID=" + KPI_ID,
        data: {},
        success: function (TitleArr) {
            
                Title = TitleArr[0][0];
                //KPI_Name = TitleArr[0][1];
                $(".main_title h3").html(Title);
                 //$(".main_title h4").html(KPI_Name);         
        }
    });
    
   
}

function loadDefaultKPISideMenu(){
    //$(".default-opt>li:first>a").trigger('click');
    //$(".default-opt>li:first").addClass("active");
    $(".pcoded-hasmenu a:first").click();
    $(".pcoded-submenu li:first").addClass("active");
    $(".pcoded-submenu li a")[0].click();
    $(".pcoded-submenu li a").click(function(){
                                      $(".pcoded-submenu li a").parent().removeClass("active");
                                      $(this).parent().addClass("active");                          
                                      });
}





function LoadKPI(KPI) // When any side navigation button is clicked
{
    //Reset and Clear element code should run first - Try to put this in seperate function
    
    $("ul.nav.child_menu>li.active").removeClass("active");
    console.clear();
    console.log("Start Loading...."+  GetTime());
    KPI_ID = KPI;
    RenderTitle();
    console.log("Render Title  "+  GetTime());
    
    //PopulateSelectedFilters('FilterContainer', KPI, 'Y');
    DefaultPopulateSelectedFilters('FilterContainer');
    console.log("PopulateSelectedFilters  "+  GetTime());
    RenderFilters('FilterContainer');
    console.log("Render Filters  "+  GetTime());
    getComments(KPI);
    console.log("Comments loaded  "+  GetTime());
    
}






function renderChart(xaxis, seriesJSON, Container) {
if (charttype == '' && charttype == null)
        charttype = 'column';
    
    Chart =
            Highcharts.chart(Container, {
                colors: ["#546686","#3ccabd","#922427","#da7e30","#6b4c9a","#3869b1","#958c3d","#535055","#cc2428"],
                        //["#bfeaff", "#ffd9bf", "#fff7bf", "#d1bfff", "#ffeabf", "#f15c80"],
                chart: {
                    type: charttype,
                    marginLeft:200,
                    //backgroundColor : "#404e67",
                    zoomType: 'xy',
                    resetZoomButton: {
                        position: {
                            x: 0,
                            y: -10
                        }
                    }
                },
                title : '',
                exporting: {
                    filename: 'chartdata',
                    enabled: true,
                    buttons:{
                        contextButton:{
                            align:"left"
                        }
                    },
                    verticalAlign: "top"

                }
                ,
                credits: {
              enabled: false
                        },
                xAxis: {
                    categories: xaxis,
                    reversed: true
                },
                yAxis: {
                    min: 0,
                    title: '',
                    opposite: true
                },

                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr>' +
                            '<td style="padding:0"><b>{point.y:.1f}</b></td><td> : </td>\
                            <td style="padding:0;text-align: right">{series.name} </td><td>\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e</td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            backgroundColor:"#FFF"
                        }
                    },
                    line: {
                        dataLabels: {
                            align:"right",
                            enabled: true,
                            backgroundColor:'rgba(255, 255, 255, 0.6)',//"#FFF",
                        },
                        enableMouseTracking: true
                        ,animation: {
                                    duration: 2000
                                    }
                    },
                    area: {
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    },
                    spline: {
                        dataLabels: {
                            enabled: true,
                            backgroundColor:'rgba(255, 255, 255, 0.6)'
                        },
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    }
                },
                legend: {
                    borderColor:"#ddd",
                    borderRadius:10,
                    borderWidth:1

                },
                series: seriesJSON
                        /*[{
                         name: legend[0][1],
                         data: data[1]
                         
                         }, {
                         name: legend[1][1],
                         data: data[2]
                         
                         }]*/
            });
}


function getComments(KPI) {
    $.ajax({type: "GET", method: "GET", async: true,
        contentType: "application/json", dataType: "json",
        url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getComments?nq=true&KPI_ID=" + KPI,
        //data: {},
        success: function (data) {
            $('.list_comments').html('');
            
            formCommentLi(data);
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('.list_comments').html('<li>Error in Loading Comments</li>');
        }

    });

}



function addComment() {
    var username = $("#username").html();
    console.log(username+"------------qqq");
    var username = "Admin";
    var commentText = $("#post-comment").val().replace(/\s\s+/g, ' ');
    if(commentText.length<=0){
        return;
    }
    $('.cmnt-submit').attr('disabled', 'disabled');
    $.ajax({type: "GET", method: "GET", async: false,
        contentType: "application/json", dataType: "json",
        url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/AddComments?nq=true&KPI_ID=" + KPI_ID + "&TXT=" + commentText + "&UNAME=" + username,
        //data: {},
        success: function (data) {
            $("#post-comment").val('');
            var d = new Date();
            //$('.list_comments ul').html('');
            formCommentLi([[username, commentText, commentDateFormat(d)]]);
            //console.log(data);
            $('#comment_error').hide();
            $(".cmnt-submit").removeAttr("disabled");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#comment_error').show();
            $(".cmnt-submit").removeAttr("disabled");
        }

    });
    
}

function commentDateFormat(d){
    var MonthLabel = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    var seconds = d.getSeconds();
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    seconds = seconds < 10 ? '0'+seconds : seconds;
    return d.getDate()+"-"+ MonthLabel[d.getMonth()]+"-"+d.getFullYear()+" "+hours+" "+minutes+" "+seconds+" "+ampm;
}
function formCommentLi(comments) {
    var liString = "";
    //console.log("Printing comments");
    //console.log(comments);
    comments.forEach(function (item,i) {
        liString +=`<li>
                        <div class="row">
                            <div class="col-auto user_image">
                                <img src="../files/assets/images/`+"avatar-4"+`.jpg" alt="User">
                            </div>
                            <div class="comments_detail col">
                                <h3>`+item[0]+`</h3>
                                <p>`+item[1]+`</p>
                                <div class="date_time"><i class="feather icon-clock m-r-10"></i>`+item[2]+`</div>
                            </div>
                        </div>
                    </li>`;
    });
    
    //console.log(liString);
    $('.list_comments').append(liString);
}



function PopulateDataTable()
{
    var thead =    `<thead><tr><th style="text-align: right"> # </th>`;
    Dimensions.forEach(function(item,index){
        thead = thead + `<th style="text-align: right">`+item[1]+`</th>`;
            });
    Measures.forEach(function(item,index){
        thead = thead + `<th style="text-align: right">`+item[1]+`</th>`;
            });   
    thead = thead + `</tr></thead>`;
    
    var datacol = Dimensions.length + Measures.length;
    var tbody = `<tbody>`;
    var rownum = 1;
    DataTable.forEach(function(item,index){
        
            item.forEach(function(itm,ind){
                tbody = tbody + `<tr><td style="text-align: right">`+ rownum +`</td>`;
                rownum++;
                    itm.forEach(function(val,k){
                            if(k < datacol)
                            tbody = tbody +  `<td>`+val+`</td>`;
                        });
                tbody = tbody + `</tr>`;
                });
        
    });
    //console.log(thead);
    //console.log(tbody);
    $("#Main_datatable").html(thead + tbody);
}


function createKPICards(elements,color,measureName,value,percent){
    // elements : shoiuld be a number 1,2,3 or 4, can accmodate maximum 4 cards  in a row
    var no_of_card = $(".Kpi_cards > div").length;
    var heading = 3;
    var rows=1;
    if( elements%4 != 0 & no_of_card >= 4){
        elements = elements%4;
        rows = elements/4;
    }
    else if (elements > 4){
        elements = 4;
    }
    var col = 12/elements;
    if (elements > 2 && rows==1)
        heading = 5;
    
    var arrowString;
    if(value < 0){
        value= value * -1;
        arrowString = '<i class="feather icon-arrow-down text-c-pink f-30"></i>';
    }
    else {
        arrowString = '<i class="feather icon-arrow-up f-30 text-c-green"></i>';
    }
    // for medium screen accmodate two cards in a row irrespective of elements given
    var cardString = ` <div class="col-md-6 col-xl-`+col+`">
                                                    <div class="card widget-statstic-card">
                                                        <div class="card-header">
                                                            <div class="card-header-left">
                                                                <h`+heading+` class="Kufyan">`+measureName+`</h`+heading+`>
                                                                <p class="p-t-10 m-b-0 text-c-`+color+`">Compared to target</p>
                                                            </div>
                                                        </div>
                                                        <div class="card-block">
                                                            <i class="feather icon-sliders st-icon bg-c-`+color+`"></i>
                                                            <div class="text-center">
                                                                <h3 class="d-inline-block">`+value+`</h3>
                                                                `+arrowString+` 
                                                                <span style="direction:ltr;" class="f-right d-inline-block bg-c-`+color+`">`+percent+`%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`;
    
    $(".Kpi_cards").append(cardString);
} 


function PlotKPIcard(){
   // var obj_map = new Object();
$(".Kpi_cards").html('');
   var colors = ['yellow','blue','green','pink','orange'];
   /* var int LegendCount = 0;
    Dimensions.forEach(function(item){
        if(item[2] == "L")
        LegendCount = LegendCount + 1;    
    });*/
    
    var total_no_of_cards = Series.length;
    
    $.each(Series,function(index,item){
        var Measure_name = item.name;
        var ind = index % Measures.length;
        var target_value = Measures[ind][4];
        var value = item['data'][item['data'].length-1]-target_value;
        createKPICards(total_no_of_cards,colors[index],Measure_name,value,(value*100/target_value).toFixed(1));
    //    createKPICards(total_no_of_cards,colors[index],Measure_name,value,(value*100/target_value).toFixed(1));
    //    createKPICards(total_no_of_cards,colors[index],Measure_name,value,(value*100/target_value).toFixed(1));
    });
    //createKPICards(3,colors[2],"Test 3",-1000,35);
   // createKPICards(4,colors[3],"Test 4",-400);
}



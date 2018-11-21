var KPIGrp = [];

function PrepareKPIGrp(){
   $.ajax({type: "GET", method: "GET", async: true,
        contentType: "application/json", dataType: "json",
        url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getSideMenu?nq=true&username=" + "",
        data: {},
        success: function (data) {
            var SideMenu = "";
            var CurGrp = "";
            var PrevGrp = " ";
            var DefaultKPI = "1";
            var i= -1;
             data.forEach(function(item,index,Arr){
                 CurGrp =   item[1];
                if(PrevGrp != CurGrp){
                        i++;
                        KPIGrp[i] = {};
                        KPIGrp[i].GrpName = CurGrp;
                        KPIGrp[i].KPIName = [];
                        KPIGrp[i].KPINum = [];
                        KPIGrp[i].KPIName.push(item[2]);
                        KPIGrp[i].KPINum.push(item[0]);
                        
                }
                 else{
                        KPIGrp[i].KPIName.push(item[2]);
                        KPIGrp[i].KPINum.push(item[0]);
                     }
                 PrevGrp = CurGrp;
                 
             });
            console.log(KPIGrp);
        }
        });
}

function RenderPage(GrpName){
    PrepareKPIGrp();
    KPIGrp.forEach(function(item,index){
        if(item.GrpName == GrpName)
            {
                   item.KPIName.forEach(function(it,ind){
                                            
                $(".page-body").append(`<div class="row">
                                            <div class="col-lg-12">
                                                <!-- Default card start -->
                                                <div class="card">
                                                     <div class="card-header main_title">
                                                        <center><h3>`+ it +`</h3></center>
                                                         <span>KPI Description will go here....................................</span>
                                                    </div>` + GetPsuedoTable());
                       
                
                       
                   });
                                            
            }
        
    });
    
}

function PopulateGrpDropdown(username){
    PrepareKPIGrp(RedirecttoDefault);
    var Grpdropdown = 
                                `<div class="row">
                                <div class="col-sm-12 col-xl-3 m-b-30">
                                <h4 class="sub-title">Group Name</h4>
                                <select name="select" class="form-control form-control-primary">`;
    
    KPIGrp.forEach(function(item,index){
        if(index == 0)
           Grpdropdown = Grpdropdown+ `<option value="`+item.KPINum+`" selected="true">`+item.KPIName+`</option>`;
        else
           Grpdropdown = Grpdropdown+ `<option value="`+item.KPINum+`">`+item.KPIName+`</option>`;
        
        
    });
    
            Grpdropdown = Grpdropdown +  `</select></div></div>`;
            $(".page-body").append(Grpdropdown);
}


function GetPsuedoTable(){
    
    return `                       <div class="card-block">


<table class="table table-styling table-hover table-striped table-primary">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style="text-align: right">#</th>
                                                                                <th style="text-align: right">First Name</th>
                                                                                <th style="text-align: right">Last Name</th>
                                                                                <th style="text-align: right">Username</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody><tr>
                                                                                <th scope="row">1</th>
                                                                                <td>Mark</td>
                                                                                <td>Otto</td>
                                                                                <td>@mdo</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th scope="row">2</th>
                                                                                <td>Jacob</td>
                                                                                <td>Thornton</td>
                                                                                <td>@fat</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th scope="row">3</th>
                                                                                <td>Larry</td>
                                                                                <td>the Bird</td>
                                                                                <td>@twitter</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                            </div></div></div></div>`;
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
                tbody = tbody + `<tr><th style="text-align: right">`+ rownum +`</th>`;
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

            
            
   /*         data.forEach(function(item,index,Arr){
                 CurGrp =   item[1];
                if(PrevGrp != CurGrp)
                    {
                    if(index != 0)  //First Element doesnt require previous one to be closed  
                        SideMenu = SideMenu + `</li>`;  //closing previous group
                        
                    SideMenu = SideMenu +     
                        `<li class="pcoded-hasmenu">
                                    <a href="javascript:void(0)">
                                        <span class="pcoded-micon"><i class="feather icon-layers"></i></span>
                                        <span class="pcoded-mtext">`+CurGrp+`</span>
                                    </a>
                                    <ul class="pcoded-submenu">
                                        <li class=" ">
                                            <a onclick="LoadKPI('`+item[0]+`')" href="#KPI`+item[0]+`">
                                                <span class="pcoded-mtext">`+item[2]+`</span>
                                            </a>
                                        </li>
                                   </ul>`;
                    }else
                    {
                     SideMenu = SideMenu +  
                                    `<ul class="pcoded-submenu">
                                        <li class=" ">
                                            <a onclick="LoadKPI('`+item[0]+`')" href="#KPI`+item[0]+`">
                                                <span class="pcoded-mtext">`+item[2]+`</span>
                                            </a>
                                        </li>
                                   </ul>`;
                       
                    }
                if(index == Arr.length-1)  //last element needs closure  
                SideMenu = SideMenu + `</li>`; 
                
                PrevGrp = CurGrp;
            });
            $(".pcoded-item").html(SideMenu);
            RTLSideMenuReload();
            if(RedirecttoDefault)
            loadDefaultKPISideMenu();
            
        }
    }); 
    
}*/
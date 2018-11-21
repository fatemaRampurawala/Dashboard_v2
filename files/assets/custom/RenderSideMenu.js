function RenderSideMenu(RedirecttoDefault){
   $.ajax({type: "GET", method: "GET", async: true,
        contentType: "application/json", dataType: "json",
        url: "http://ec2-18-191-85-190.us-east-2.compute.amazonaws.com/Test/rest/q/getSideMenu?nq=true&username=" + "",
        data: {},
        success: function (data) {
            var SideMenu = "";
            var CurGrp = "";
            var PrevGrp = " ";
            var DefaultKPI = "1";
            data.forEach(function(item,index,Arr){
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
                                    <ul class="pcoded-submenu CustomSubMenu">
                                        <li class=" ">
                                            <a onclick="LoadKPI('`+item[0]+`')" href="#KPI`+item[0]+`">
                                                <span class="pcoded-mtext CustomMenuText">`+item[2]+`</span>
                                            </a>
                                        </li>
                                   </ul>`;
                    }else
                    {
                     SideMenu = SideMenu +  
                                    `<ul class="pcoded-submenu CustomSubMenu">
                                        <li class=" ">
                                            <a onclick="LoadKPI('`+item[0]+`')" href="#KPI`+item[0]+`">
                                                <span class="pcoded-mtext CustomMenuText" >`+item[2]+`</span>
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
    
}
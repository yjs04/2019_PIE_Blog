class Write{
    constructor(){
        this.writeEvent();
        this.focus = 0;
        this.focus_line = document.querySelector("#write_content").firstChild;
        this.scroll = 0;
        this.image = new Array();
        this.color = [
            [],
            ["78281F","943126","B03A2E","CB4335","E74C3C","EC7063","F1948A","F5B7B1"],//red
            ["7E5109","9C640C","B9770E","D68910","F39C12","F5B041","F8C471","FAD7A0"],//orange
            ["7D6608","9A7D0A","B7950B","D4AC0D","F1C40F","F4D03F","F7DC6F","F9E79F"],//yellow
            ["145A32","196F3D","1E8449","229954","27AE60","52BE80","7DCEA0","A9DFBF"],//green
            ["1B4F72","21618C","2874A6","2E86C1","3498DB","5DADE2","85C1E9","AED6F1"],//blue
            ["4A235A","5B2C6F","6C3483","7D3C98","8E44AD","A569BD","BB8FCE","D2B4DE"] //purple
        ];
    }

    writeEvent(){
        window.addEventListener("click",(e)=>{
            if((document.querySelector("#linkPopup") && e.target.id !== "linkPopup" && e.target.parentNode.id !== "linkPopup" && e.target.parentNode.parentNode.id !== "linkPopup" && e.target.parentNode.parentNode.parentNode.id !== "linkPopup") || (e.target.id == "write_link_button_n")) this.writePageOut();
            if(($("#write_link_button_y").css("color") !=="rgb(231, 231, 231)")&& e.target.id == "write_link_button_y" && document.querySelector("#write_link_popup_text").value.length >0) this.MakeLink();
            if(e.target.id == "write_ok") this.writeUploadProcess();
            if(e.target.id == "write_content") this.focus = window.getSelection().focusOffset;
            if(e.target.id == "write_toolBox_door" || e.target.id == "write_toolBox_door_icon" || e.target.id == "write_toolBox_door_title") this.WriteToolBox();
            if(e.target.classList.contains("write_Tool_button") || e.target.classList.contains("write_Tool_button_icon")) this.writeTool(e.target.id);
            if((e.target.id == "write_tool_color_picker_close" || e.target.id == "write_tool_color_picker_not" )&& document.querySelector("#write_color").classList.contains("active")) this.writeTool("write_color");
            if((e.target.id == "write_tool_color_picker_close" || e.target.id == "write_tool_color_picker_not" )&& document.querySelector("#write_backcolor").classList.contains("active")) this.writeTool("write_backcolor");
            if(e.target.classList.contains("write_tool_color_picker_color")) this.writeColorClick(e.target.style.backgroundColor);
            if(e.target.id == "write_tool_color_picker_color_ok") this.writeColorfont();
            if(e.target.id == "modify_ok") this.writeModifyProcess();
        });
        if(document.querySelector("#modify_ok")) this.writeModifyImg()
        window.addEventListener("keyup",(e)=>{ 
            if(document.querySelector("#linkPopup")&& e.target.id == "write_link_popup_url") this.writelinkurl();
            if(e.target.id == "write_content"){
                this.scroll = window.getSelection().focusNode.offsetTop;
                if(!this.scroll) this.scroll = window.getSelection().focusNode.parentElement.offsetTop;
                $(document).scrollTop(this.scroll+20);
            }
            if(e.target.id == "write_tool_color_picker_color_now") this.writenowSelectColor();
        });

        window.addEventListener("change",(e)=>{
            if(e.target.id == "write_img_input") this.write_img_inner_content(e.target.files);
        });
        
        document.onselectionchange = ()=>{
            let write_content = document.querySelector("#write_content");
            if(document.getSelection().anchorNode && (document.getSelection().anchorNode.parentNode && document.getSelection().anchorNode.parentNode !== write_content )) return;
            if(document.getSelection().anchorNode &&(document.getSelection().anchorNode.parentNode.parentNode  &&  document.getSelection().anchorNode.parentNode.parentNode !== write_content)) return;
            this.focus = window.getSelection().anchorOffset;
            this.focus_line = window.getSelection().anchorNode;
        }
    }

    // writeTool

    writeTool(id){
        let target = id.split("_");
        if(target[target.length - 1] == 'icon'){
            id = "";
            for(let i = 0; i<target.length -1 ; i++){
                id += target[i];
                if( i !== target.length - 2) id +="_";
            }
        }
        if(id == "write_link" || id == "write_link_icon") this.MakeWritelink();
        if(id == "write_bold" || id == "write_bold_icon") document.execCommand("bold");
        if(id == "write_italic" || id == "write_italic_icon") document.execCommand("italic");
        if(id == "write_color" || id == "write_color_icon") this.setWriteColor();
        if(id == "write_backcolor" || id == "write_backcolor_icon")this.setWriteColor();
        if(id == "write_img" || id == "write_img_icon") this.MakeWriteImg();
        if(id == "write_aleft" || id == "write_aleft_icon") this.WriteToolAlign(0);
        if(id == "write_acenter" || id == "write_acenter_icon") this.WriteToolAlign(1);
        if(id == "write_aright" || id == "write_aright_icon") this.WriteToolAlign(2);
        if(id == "write_afull" || id == "write_afull_icon") this.WriteToolAlign(3);
        if(document.querySelector("#"+id).classList.contains("active")) document.querySelector("#"+id).classList.remove("active");
        else document.querySelector("#"+id).classList.add("active");
    }

    // writeTool : img
    MakeWriteImg(){
        let imgForm = document.createElement("form");
        imgForm.id = "write_img_input_box";
        document.querySelector("#writePage").appendChild(imgForm);
        let file = document.createElement("input");
        file.id = "write_img_input";
        file.type = "file";
        file.name = "img"; 
        document.querySelector("#write_img_input_box").appendChild(file);
        $("#write_img_input").trigger("click");
    }

    write_img_inner_content(){
        let file = document.querySelector("#write_img_input").files.length > 0 ? document.querySelector("#write_img_input").files[0] :null;
        if(file == null) return;
        // 
        let form_data = new FormData(document.querySelector("#write_img_input_box"));
        form_data.append("fileobj",file);
        $.ajax({
            url:"/write/image",
            method:"post",
            processData:false,
            contentType:false,
            data:form_data,
            success:(data)=>{
                let msg = JSON.parse(data);
                if(msg.split(".")[0] !== 'true') alert(msg);
                else{
                    // 
                    let url = '/image/upload/'+msg.split(".")[1]+"."+msg.split(".")[2];
                    $("#write_content").focus();
                    window.getSelection().collapse(this.focus_line,this.focus);
                    this.image[this.image.length] = url;
                    let html = `<img src=${url} width="500" alt="image">`;
                    document.execCommand("insertHTML",false,html);
                    //    
                }
            }
        });
        document.querySelector("#writePage").removeChild(document.querySelector("#write_img_input_box"));
    }

    // writeTool - color / backgroundColor

    setWriteColor(){
        if(document.querySelector("#write_color").classList.contains("active") || document.querySelector("#write_backcolor").classList.contains("active")){
            setTimeout(()=>{
                document.querySelector("#write_tool_colorpicker").classList.remove("active");
                setTimeout(()=>{
                    document.querySelector("#writePage").removeChild(document.querySelector("#write_tool_colorpicker"));
                },500);
            },100);
        }else{
            setTimeout(()=>{
                document.querySelector("#writePage").appendChild(this.MakeColorPickerTable());
                setTimeout(()=>{
                    document.querySelector("#write_tool_colorpicker").classList.add("active");
                    this.setWriteColorback();
                },100);
            },100);
        }
    }
    
    // color Table생성
    MakeColorPickerTable(){
        let colorpicker = document.createElement("div");
        colorpicker.id ="write_tool_colorpicker";
        let colortable = `
            <div id="write_tool_colorpicker_top">
                <div class="write_tool_color_picker_row">
                    <div class="write_tool_color_picker_colors" id = "write_tool_color_picker_close"><div id="write_tool_color_picker_not"></div></div>
                    `;
                    for(let i =0;i<7;i++){
                        colortable +=`<div class="write_tool_color_picker_color"></div>`;
                        if( i == 6) colortable+=`</div>`;
                    }
                for(let j = 0; j<6; j++){
                    colortable+=`<div class="write_tool_color_picker_row">`;
                    for(let i = 0; i<8; i++) colortable+= `<div class="write_tool_color_picker_color"></div>`;
                    colortable+=`</div>`;
                }
            colortable+=`</div>
            <div id="write_tool_color_picker_bottom">
                <div class="write_tool_color_picker_color_select"></div>
                <input type="text" placeholder = "#000000" id = "write_tool_color_picker_color_now">
                <button class="write_tool_color_picker_color_button" id = "write_tool_color_picker_color_ok">입력</button>
            </div>`;
            colorpicker.innerHTML +=colortable; 
        return colorpicker;
    }

    // color Table값넣기
    setWriteColorback(){
        let colorsite = ["0","E","B","9","7","4","2","0"];
        for(let i = 1; i< 8;i++){
            document.querySelectorAll(".write_tool_color_picker_row")[0].children[i].style.backgroundColor = "#"+colorsite[i]+colorsite[i]+colorsite[i];
        }
        for(let i = 1; i<7;i++){
            for(let j = 0; j<8;j++){
                document.querySelectorAll(".write_tool_color_picker_row")[i].children[j].style.backgroundColor = "#"+this.color[i][7-j];
            }
        }
    }

    // color click event
    writeColorClick(color){
        let rgb = color.split(",");
        for(let i = 0; i < 3; i++) rgb[i] = parseInt(Number(rgb[i].match("([0-9])+")[0]),10).toString(16).length == 1 ? "0"+parseInt(Number(rgb[i].match("([0-9])+")[0]),10).toString(16) : parseInt(Number(rgb[i].match("([0-9])+")[0]),10).toString(16);
        document.querySelector("#write_tool_color_picker_color_now").value = "#"+rgb[0]+rgb[1]+rgb[2];
        this.writenowSelectColor("#"+rgb[0]+rgb[1]+rgb[2]);
    }
    
    // 현재 선택된 color 보여줌
    writenowSelectColor(Scolor = ""){
        if(Scolor == ""){
            let color = document.querySelector("#write_tool_color_picker_color_now").value;
            color = color.substring(0,1) !== "#" ? "#"+color : color;
            document.querySelector(".write_tool_color_picker_color_select").style.backgroundColor = color;
        }else document.querySelector(".write_tool_color_picker_color_select").style.backgroundColor = Scolor;
    }
    
    // 선택된 color 적용
    writeColorfont(){
        let color = document.querySelector(".write_tool_color_picker_color_select").style.backgroundColor;
        let rgb = color.split(",");
        for(let i = 0; i < 3; i++) rgb[i] = parseInt(Number(rgb[i].match("([0-9])+")[0]),10).toString(16).length == 1 ? "0"+parseInt(Number(rgb[i].match("([0-9])+")[0]),10).toString(16) : parseInt(Number(rgb[i].match("([0-9])+")[0]),10).toString(16);
        $("#write_content").focus();
        window.getSelection().collapse(this.focus_line,this.focus);
        if(document.querySelector("#write_color").classList.contains("active")) document.execCommand("forecolor",false,"#"+rgb[0]+rgb[1]+rgb[2]);
        if(document.querySelector("#write_backcolor").classList.contains("active")) document.execCommand("backColor",false,"#"+rgb[0]+rgb[1]+rgb[2]);
        if(document.querySelector("#write_color").classList.contains("active")) this.writeTool("write_color");
        if(document.querySelector("#write_backcolor").classList.contains("active")) this.writeTool("write_backcolor");
    }

    
    // write Tool : text-align

    WriteToolAlign(mode){
        let list = ["aleft","acenter","aright","afull"];
        for(let i = 0; i<4; i++) if(i !== mode && document.querySelector("#write_"+list[i]).classList.contains("active")) document.querySelector("#write_"+list[i]).classList.remove("active");
        if(mode == 0) document.execCommand("justifyLeft");
        if(mode == 1) document.execCommand("justifyCenter");
        if(mode == 2) document.execCommand("justifyRight");
        if(mode == 3) document.execCommand("justifyFull");
    }

    // Tool animation
    WriteToolBox(){
        if(document.querySelector("#write_toolBox_door").classList.contains("active")){
            document.querySelector("#write_toolBox_door").classList.remove("active");
            document.querySelector("#write_toolBox").classList.remove("active");
            if(document.querySelector("#write_tool_colorpicker")&&document.querySelector("#write_tool_colorpicker").classList.contains("active")) document.querySelector("#write_tool_colorpicker").classList.remove("active");
            for(let i = 0; i<10; i++)if(document.querySelectorAll(".write_Tool_button")[i].classList.contains("active")) document.querySelectorAll(".write_Tool_button")[i].classList.remove("active");
        }else{
            document.querySelector("#write_toolBox_door").classList.add("active");
            document.querySelector("#write_toolBox").classList.add("active");
        }
    }

    // write Tool : append link

    // link 적는창
    MakeWritelink(){
        setTimeout(()=>{
            let linkPopup = document.createElement("div");
            linkPopup.id = "linkPopup";
            linkPopup.innerHTML=`
                <h2>링크 삽입</h2>
                <div class = "write_link_popup_box">
                    <label for="write_link_popup_text" class="write_link_popup_label">Text</label>
                    <input type = "text" class ="write_link_popup_input" id="write_link_popup_text" placeholder="URL을 연결할 텍스트를 입력해주세요">
                </div>
                <div class = "write_link_popup_box">
                    <label for="write_link_popup_url" class="write_link_popup_label">URL</label>
                    <input type = "text" class ="write_link_popup_input" id="write_link_popup_url" placeholder="URL을 입력해주세요">
                </div>
                <div id="write_link_popup_button_box">
                    <button class="write_link_popup_button" id="write_link_button_y">확인</button>
                    <button class="write_link_popup_button" id="write_link_button_n">취소</button>
                </div>
            `;
            document.querySelector("body").appendChild(linkPopup);
            let linkbc = document.createElement("div");
            linkbc.id = "linkbc";
            document.querySelector("body").appendChild(linkbc);
            setTimeout(()=>{
                document.querySelector("#linkPopup").classList.add("active");
                document.querySelector("#linkbc").classList.add("active");
            },100);
        },100);
    }

    // link 조건에 맞는지 검사
    writelinkurl(){
        let url = document.querySelector("#write_link_popup_url").value;
        if(/^(https||http):\/\/(([a-zA-Z][-a-zA-Z0-9]*([.][a-zA-Z][-a-zA-Z0-9]*){0,3})||([0-9]{1,3}([.][0-9]{1,3}){3}))$/.test(url)){
            document.querySelector("#write_link_button_y").style.color = "#24D0C3";
            document.querySelector("#write_link_button_y").addEventListener("mouseover",()=>{
                document.querySelector("#write_link_button_y").style.backgroundColor = "#24D0C3";
                document.querySelector("#write_link_button_y").style.color = "#fff";
                document.querySelector("#write_link_button_y").style.cursor="pointer";
            });
            document.querySelector("#write_link_button_y").addEventListener("mouseout",()=>{
                document.querySelector("#write_link_button_y").style.backgroundColor = "#fff";
                document.querySelector("#write_link_button_y").style.color = "#24D0C3";
            });
        }else{
            document.querySelector("#write_link_button_y").style.color = "#E7E7E7";
            document.querySelector("#write_link_button_y").style.cursor="none";
            document.querySelector("#write_link_button_y").addEventListener("onmouseover",()=>{
                document.querySelector("#write_link_button_y").style.backgroundColor = "#fff";
                document.querySelector("#write_link_button_y").style.color = "#E7E7E7";
            });
            document.querySelector("#write_link_button_y").addEventListener("onmouseout",()=>{
                document.querySelector("#write_link_button_y").style.backgroundColor = "#fff";
                document.querySelector("#write_link_button_y").style.color = "#E7E7E7";
            });
        }
    }

    // linkpopup animation
    writePageOut(){
        setTimeout(()=>{
            document.querySelector("#linkPopup").classList.remove("active");
            document.querySelector("#linkbc").classList.remove("active");
            setTimeout(()=>{
                document.querySelector("body").removeChild(document.querySelector("#linkPopup"));
                document.querySelector("body").removeChild(document.querySelector("#linkbc"));
            },500);
        },100);
    }

    // link 생성
    MakeLink(){
        let text = document.querySelector("#write_link_popup_text").value, value = document.querySelector("#write_link_popup_url").value;
        this.writePageOut();
        $("#write_content").focus();
        document.querySelector("#write_link").classList.remove("active");
        window.getSelection().collapse(this.focus_line,this.focus);
        let html = `<a href='${value}' target='_blank'>${text}</a>`;
        document.execCommand("insertHTML",false,html);
    }

    // uploadProcess
    writeUploadProcess(){
        $.ajax({
            url:"/user/write",
            method:"get",
            success:(data)=>{
                let user = JSON.parse(data);
                if(user == false){
                    alert("로그인 후 이용하실 수 있습니다.");
                    $("#login_go").trigger("click");
                }else{
                    let image_array = new Array();
                    let title = document.querySelector("#write_title").value;
                    let content = $("#write_content").html();
                    let category = document.querySelector("#write_category").value;
                    if(title.length == 0 || content.length == 0) {
                        alert("내용을 채워주세요!");
                        return;
                    }else{
                        let image_post = "";
                        if (this.image.length == 0) image_array = "";
                        else{
                            this.image.forEach((item)=>{
                                console.log(item);
                                console.log(content.match(`<img src="${item}" width="500" alt="image">`));
                                if(content.match(`<img src="${item}" width="500" alt="image">`)) image_array += ","+item;
                                else{
                                    $.ajax({
                                        url:'/write/image/del',
                                        method:"post",
                                        data:{"url":item},
                                    });
                                }
                            });
                            image_post = image_array.substring(1,image_array.length);
                        }
                        $.ajax({
                            url:"/user/writeUpload",
                            method:"post",
                            data:{
                                "title":title,
                                "content":content,
                                "category":category,
                                "img":image_post
                            },
                            success:(data)=>{
                                let msg = JSON.parse(data);
                                if(msg !== false){
                                    alert("글이 정상적으로 포스팅되었습니다.");
                                    location = "/";
                                }
                            }
                        });
                    }
                }
            }
        });
    }

    writeModifyImg(){
        let id = document.querySelector("#modify_ok").className.split("_")[1];
        $.ajax({
            url:"/write/modify/img",
            method:"post",
            data:{"id":id},
            success:(data)=>{
                let img = JSON.parse(data);
                if(img['img'].length !== 0){
                    img['img'].split(",").forEach((item)=>{
                        this.image[this.image.length] += item;
                    });
                    
                    this.image.forEach((item,key)=>{
                        this.image[key] = item.substring(9,item.length);
                    });
                }
            }
        });
    }

    writeModifyProcess(){
        $.ajax({
            url:"/user/write",
            method:"get",
            success:(data)=>{
                let user = JSON.parse(data);
                if(user == false){
                    alert("로그인 후 이용하실 수 있습니다.");
                    $("#login_go").trigger("click");
                }else{
                    let image_array = new Array();
                    let title = document.querySelector("#write_title").value;
                    let content = $("#write_content").html();
                    let category = document.querySelector("#write_category").value;
                    let id = document.querySelector("#modify_ok").className.split("_")[1];
                    let writer_id = document.querySelector("#modify_ok").className.split("_")[2];
                    if(title.length == 0 || content.length == 0) {
                        alert("내용을 채워주세요!");
                        return;
                    }else{
                        let image_post = "";
                        if (this.image.length == 0) image_array = "";
                        else{
                            this.image.forEach((item)=>{
                                if(content.match(`<img src="${item}" width="500" alt="image">`)) image_array += ","+item;
                                else{
                                    $.ajax({
                                        url:'/write/image/del',
                                        method:"post",
                                        data:{"url":item},
                                        success:(data)=>{
                                            console.log(data);
                                        }
                                    });
                                }
                            });
                            image_post = image_array.substring(1,image_array.length);
                        }
                        $.ajax({
                            url:"/user/writeModify",
                            method:"post",
                            data:{
                                "id":id,
                                "writer_id":writer_id,
                                "title":title,
                                "content":content,
                                "category":category,
                                "img":image_post
                            },
                            success:(data)=>{
                                if(JSON.parse(data) !== false){
                                    alert("글이 정상적으로 수정되었습니다.");
                                    location = "/";
                                }else alert(data);
                            }
                        });
                    }
                }
            }
        });
    }
}

window.onload = ()=>{
    let base = new Base();
    let write = new Write();
    let join = new Join();
}
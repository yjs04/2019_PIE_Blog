class User{
    constructor(){
        this.user = [];
        this.userprofillsetmode = "photo";
        this.userinfo();
        this.userpost();
        this.UserEvent();
        this.user_menu_id = '';
    }

    UserEvent(){
        window.addEventListener("click",(e)=>{
            let id = e.target.id;
            let target = e.target;
            if(target.classList.contains("table_post_line") || (target.parentElement && target.parentElement.classList.contains("table_post_line"))){
                let num = '';
                if(target.parentElement.classList.contains("table_post_line")) num = Number(target.parentElement.id.split("_")[4]);
                else num = Number(id.split("_")[4]);
                location = "/board/view/"+num;
            }
            if(target.classList.contains("table_post_line_menu")) this.table_post_line_menu(target.className);
            if(document.querySelector("#user_post_list_menu")) this.user_post_list_Check(target.className,target.id);
            if(id == "user_setting") this.userSetting();
            if(id == "user_setting_before_check_button") this.userSettingBeforeCheck();
            if(id == "user_setting_userDel") this.userDel();
            if(id == "user_setting_modify") this.UserSetModifiy();
            if(target.classList.contains("user_profile")) this.userprofilesetting();
            if(target.classList.contains("user_profile_set_tool")) this.userprofilesetting(id.split("_")[3]);
            if(id == "user_profile_set_ok" && this.userprofillsetmode == "comment") this.UserprofilecommentSet();
            if(target.classList.contains("user_profile_add")) $("#user_profile_photo_input").trigger("click");
            if(id == "user_profile_set_ok" && this.userprofillsetmode == "photo") this.userprofilephotoset();
            if(id == "user_profile_photo_reset" && this.userprofillsetmode == "photo") this.userprofilephotodel();
            if(id == "user_post_menu") this.userBackPostList();
        });

        window.addEventListener("change",(e)=>{
            let id = e.target.id;
            let classname = e.target.className;
            if(id == "user_profile_photo_input") this.userprofilephotopreview();
        });
    }

    userinfo(){
        if(document.querySelector("#nav_username")){
            $.ajax({
                url:"/user/userInfo",
                method:"post",
                data:{"mode":1},
                success:(data)=>{
                    let user = JSON.parse(data);
                    if(user == false){alert("????????? ??? ???????????? ?????????."); location = "/";}
                    else{
                        this.user = user;
                        document.querySelector("#user_name").innerHTML = `${this.user['username']}(${this.user['userid']})`;
                        if(this.user['userphoto'] == "") document.querySelector("#user_photo").innerHTML = `<i class="fas fa-user"></i>`;
                        else document.querySelector("#user_photo").innerHTML = `<img src="${this.user['userphoto']}" alt="user_profile_photo" id = "user_info_photo">`;
                        document.querySelector("#user_comment").innerHTML = this.user['usercomment'];
                    }
                }
            });
        }
    }

    userpost(){
        if(document.querySelector("#nav_username")){
            $.ajax({
                url:"/user/userInfo",
                method:"post",
                data:{"mode":2},
                success:(data)=>{
                    let post = JSON.parse(data);
                    if(post == false){alert("????????? ??? ???????????? ?????????."); location = "/";}
                    else{
                        document.querySelector("#user_photonum").innerHTML = `????????? : ${post.length}???`;
                        this.UserMakePost(post);
                    }
                }
            })
        }
    }

    UserMakePost(post){
        let table = document.createElement("table");
        table.classList.add("user_post_table");
        table.innerHTML += `
        <thead>
            <tr>
                <th>??????</th>
                <th>??????</th>
                <th>?????????</th>
                <th>View</th>
                <th>Like</th>
                <th>??????</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            ${this.UserMakePostLine(post)}
        </tbody>
        `;
        document.querySelector("#user_posts_area").appendChild(table);
    }

    UserMakePostLine(post){
        let postline = '';
        post.forEach((item)=>{
            let data = `<tr id="table_post_line_id_${item['id']}" class="table_post_line">
                            <td>${item['id']}</td>
                            <td>${item['title']}</td>
                            <td>${item['username']}</td>
                            <td>${item['view']}</td>
                            <td>${item['good']}</td>
                            <td>${item['date']}</td>
                            <td class="table_post_line_menu id_${item['id']}"><i class="fas fa-ellipsis-v table_post_line_menu id_${item['id']}${item['id']}"></i></td>
                        </tr>`;
            postline += data;
        });
        return postline;
    }

    table_post_line_menu(className){
        let id = className.match("id_([0-9+])")[1],target = className.split(" ")[3];
        let top = $("."+target).offset()['top'],left = $("."+target).offset()['left'];
        let list_menu = document.createElement("div");
        list_menu.id = "user_post_list_menu";
        list_menu.innerHTML = `
        <a href="#" id="user-delete" class="user_post_list_buttons">??????</a> 
        <a href="#" id="user-mod"    class="user_post_list_buttons">??????</a>
        `;
        document.querySelector("body").appendChild(list_menu);
        document.querySelector("#user_post_list_menu").style.top = top+"px";
        document.querySelector("#user_post_list_menu").style.left = (left - 150)+'px';
        document.querySelector("#user_post_list_menu").style.display = "block";
            setTimeout(()=>{
                document.querySelector("#user_post_list_menu").classList.add("active");
            },300);
        this.user_menu_id = id;
    }

    user_post_list_Check(className,id){
        let name = className;
        if(name !== null && (name == "user_post_list_buttons" || name.split(" ")[3] == "id_"+this.user_menu_id)){
            if(id){
                if(id == "user-delete") this.UserDelete(this.user_menu_id,this.user['id']);
                else if(id == "user-mod") this.UserModifiy(this.user_menu_id,this.user['id']);
            }
        }else{
            if(document.querySelector("#user_post_list_menu").classList.contains("active")){
                document.querySelector("#user_post_list_menu").classList.remove("active");
                this.user_menu_id = '';
                setTimeout(()=>{
                    document.querySelector("body").removeChild(document.querySelector("#user_post_list_menu"));
                },500);
            }
        }
    }

    UserDelete(view,writer_id){
        let check = confirm("???????????? ?????????????????????????");
        if(check){
            $.ajax({
                url:"/board/delete",
                method:"post",
                data:{"id":view,"writer_id":writer_id},
                success:(data)=>{
                    let alert_data = JSON.parse(data);
                    alert(alert_data);
                    location = "/user/myPage";
                }
            });
        }
    }

    UserModifiy(view,writer_id){
        let check = confirm("?????????????????? ????????????????");
        if(check){
            $.ajax({
                url:"/board/modify",
                method:"post",
                data:{"id":view,"writer_id":writer_id},
                success:(data)=>{
                    let msg = JSON.parse(data);
                    if(msg !== true) alert(msg);
                    else location = "/board/mod/"+view+"/"+writer_id;
                }
            });
        }
    }

    userSetting(){
        document.querySelector("#user_title").innerHTML = "??????";
        document.querySelector("#user_posts_area").innerHTML = `
            <h2 id="user_settiing_before_check_title">??????????????? ?????? ??????????????? ??????????????????.</h2>
            <input type = "password" id="user_setting_before_check" placeholder="??????????????? ??????????????????">
            <p id="user_setting_before_check_error"></p>
            <button id="user_setting_before_check_button">??????</button>
            `;
        if(document.querySelector("#user_profile").classList.contains("active")) document.querySelector("#user_profile").classList.remove("active");
        document.querySelector("#user_post_menu").classList.add("active");
        document.querySelector("#user_setting").classList.add("active");
    }

    userDel(){
        let check = confirm("?????????????????????????");
        if(check){
            $.ajax({
                url:"/user/delete",
                method:"post",
                data:{"id":this.user['id']},
                success:(data)=>{
                    let del = JSON.parse(data);
                    if(del !== false){
                        alert("?????????????????????.");
                        location = "/";
                    }else{
                        alert("???????????? ????????? ?????????????????????.");
                        location = "/";
                    }
                }
            });
        }
    }

    userSettingBeforeCheck(){
        let password = document.querySelector("#user_setting_before_check").value;
        $.ajax({
            url:"/user/mypage/settingcheck",
            method:"post",
            data:{"id":this.user['id'],"password":password},
            success:(data)=>{
                let info = JSON.parse(data);
                if(info !== false){
                    document.querySelector("#user_posts_area").innerHTML = `
                    
                        <div class="user_setting_box">
                            <label for="user_setting_id">?????????</label>
                            <input type="text" name="user_setting_id" id="user_setting_id" class="user_setting_input" value = ${this.user['userid']}>
                        </div>
                        <div class="user_setting_box">
                            <label for="user_setting_name">??????</label>
                            <input type="text" name="user_setting_name" id="user_setting_name" class="user_setting_input" value = ${this.user['username']}>
                        </div>
                        <div class="user_setting_box">
                            <label for="user_setting_password">????????????</label>
                            <input type="password" name="user_setting_password" id="user_setting_password" class="user_setting_input">
                        </div>
                        <div class="user_setting_box">
                            <label for="user_setting_passwordc">???????????? ??????</label>
                            <input type="password" name="user_setting_passwordc" id="user_setting_passwordc" class="user_setting_input">
                        </div>
                        <button id="user_setting_modify">??????</button>
                        <button id="user_setting_userDel">????????????</button>
                    `;
                }else document.querySelector("#user_setting_before_check_error").innerHTML = "?????????????????? ?????????????????????.";
            }
        });
    }

    UserSetModifiy(){
        let setid = document.querySelector("#user_setting_id").value;
        let setname = document.querySelector("#user_setting_name").value;
        let password = document.querySelector("#user_setting_password").value;
        let passwordc = document.querySelector("#user_setting_passwordc").value;
        if(password !== passwordc) alert("??????????????? ????????????????????? ????????????.");
        else if(setid.length == 0 || setname.length == 0 || setid.password == 0 || setid.password == 0) alert("????????? ???????????????!");
        else{
            // name
            $.ajax({
                url:"/user/search",
                method:"post",
                data:{"search":"username","search_word":setname},
                success:(data)=>{
                    if(data !== 'false'){alert("?????? ????????? ????????? ???????????????.");return;}
                }
            });
            // id
            if(setid.length < 3){alert("???????????? 3?????? ??????????????? ?????????.");return;}
            //2.?????? ?????? ????????????
            if(!(/^[a-z||A-Z||0-9]+$/.test(setid))){alert("???????????? ???????????? ?????? ?????? ????????? ??????????????? ?????????.");return;}
            //3.?????? X
            $.ajax({
                url:"/user/search",
                method:"post",
                data:{"search":"userid","search_word":setid},
                success:(data)=>{
                    if(data !== 'false'){alert("?????? ???????????? ????????? ???????????????.");return;}
                }
            });
            // password
            if(password.length < 8 ){alert("??????????????? 8?????? ????????????????????????.");return;}
            let reg = (/[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[~!@#$%^&*()_+|<>?:{}]/.test(password));
            if(!reg){alert("??????????????? ??????????????? ??????,??????,??????????????? ????????? ???????????? ?????????.");return;}
            $.ajax({
                url:"/user/modify",
                method:"post",
                data:{
                    "id":this.user['id'],
                    "userid":setid,
                    "username":setname,
                    "password":password
                },
                success:(data)=>{
                    let modify = JSON.parse(data);
                    if(modify !== false){alert("??????????????? ?????????????????????.");location="/user/myPage";}
                    else alert("????????? ????????? ??????????????????.");
                }
            });
        }
    }

    userprofilesetting(mode = ""){
        if(mode == ""){
            document.querySelector("#user_title").innerHTML = "????????? ??????";
            document.querySelector("#user_posts_area").innerHTML = `
            <div id="user_profile_set_tool_box">
                    <a href="#" id="user_profile_set_photo" class="user_profile_set_tool">????????? ??????</a>
                    <a href="#" id="user_profile_set_comment" class="user_profile_set_tool">????????? ?????????</a>
                    <div class="user_profile_set_tool_now photo"></div>
                </div>
                <div id="user_profile_box" class="${this.userprofillsetmode}">
                    <div id="user_profile_photo">
                        <div id="user_profile_preview">

                        </div>
                        <div id="user_profile_photo_info">
                            <form id="user_profile_photo_form">
                                <input type="file" id="user_profile_photo_input" name="img">
                            </form>
                            <button id="user_profile_add" class="user_profile_add"><i class="fas fa-plus user_profile_add"></i> ?????? ????????????</button>
                            <button id="user_profile_photo_reset">?????? ?????????</button>
                        </div>
                    </div>
                    <div id="user_profile_comment">
                        <textarea id="user_profile_comment_input"></textarea>
                    </div>
                    <button id="user_profile_set_ok">??????</button>
                </div>
            `;
            document.querySelector("#user_profile_set_"+this.userprofillsetmode).classList.add("active");
            if(this.user['userphoto'] !== '') document.querySelector("#user_profile_preview").innerHTML = `<img id='user_profile_preview_img' src = '${this.user['userphoto']}'>`
            if(document.querySelector("#user_setting").classList.contains("active")) document.querySelector("#user_setting").classList.remove("active");
            document.querySelector("#user_post_menu").classList.add("active");
            document.querySelector("#user_profile").classList.add("active");
        }else{
            if(mode == "photo"){
                document.querySelector("#user_profile_set_photo").classList.add("active");
                document.querySelector("#user_profile_set_comment").classList.remove("active");
                document.querySelector(".user_profile_set_tool_now").classList.replace("comment","photo");
            }else{
                document.querySelector("#user_profile_set_photo").classList.remove("active");
                document.querySelector("#user_profile_set_comment").classList.add("active");
                document.querySelector(".user_profile_set_tool_now").classList.replace("photo","comment");
            }
            this.userprofillsetmode = mode;
            document.querySelector("#user_profile_box").classList.replace(document.querySelector("#user_profile_box").className,mode);
        }
    }

    UserprofilecommentSet(){
        if(this.userprofillsetmode == "comment"){
            let comment = document.querySelector("#user_profile_comment_input").value;
            if(comment.length == 0) alert('????????? ???????????????!');
            $.ajax({
                url:"/user/commentset",
                method:"post",
                data:{
                    "id":this.user['id'],
                    "comment":comment
                },
                success:(data)=>{
                    let comment_ok = JSON.parse(data);
                    if(comment_ok !==false){
                        alert("???????????? ?????????????????????!");
                        location = "/user/myPage";
                    }else{alert("???????????? ????????? ??????????????????.");}
                }
            });
        }
    }

    userprofilephotopreview(){
        let file = document.querySelector("#user_profile_photo_input").files.length > 0 ? document.querySelector("#user_profile_photo_input").files[0] :null;
        let src = URL.createObjectURL(file);
        if(!document.querySelector("#user_profile_preview_img"))document.querySelector("#user_profile_preview").innerHTML = `<img id='user_profile_preview_img'>`;
        document.querySelector("#user_profile_preview_img").src = src;
        if(document.querySelector("#user_profile_preview").classList.contains("reset")) document.querySelector("#user_profile_preview").classList.remove("reset");
    }

    userprofilephotoset(){
        if(this.userprofillsetmode == "photo"){
            if(document.querySelector("#user_profile_preview").classList.contains("reset")){
                document.querySelector("#user_profile_photo_form").innerHTML+=`<input name='reset' type = 'text' id='user_profile_photo_reset_input' value ='true'>`;
            }
            let file = document.querySelector("#user_profile_photo_input").files.length > 0 ? document.querySelector("#user_profile_photo_input").files[0] :'';
            // 
            let form_data = new FormData(document.querySelector("#user_profile_photo_form"));
            form_data.append("fileobj",file);
            $.ajax({
                url:"/user/image",
                method:"post",
                processData:false,
                contentType:false,
                data:form_data,
                success:(data)=>{
                    let msg = JSON.parse(data);
                    if(msg.split(".")[0] == 'reset'){
                        alert(msg.split(".")[1]);
                        location = "/user/myPage";
                    }
                    else if(msg.split(".")[0] !== 'true') alert(msg);
                    else{
                        alert("????????? ????????? ?????????????????????.");
                        location = "/user/myPage";
                    }
                }
            });
        }
    }

    userprofilephotodel(){
        if(this.userprofillsetmode == "photo" && this.user['userphoto']){
            document.querySelector("#user_profile_preview").classList.add("reset");
            document.querySelector("#user_profile_preview").removeChild(document.querySelector("#user_profile_preview_img"));
            document.querySelector("#user_profile_photo_input").value = '';
        }
    }

    userBackPostList(){
        document.querySelector("#user_post_menu").classList.remove("active");
        if(document.querySelector("#user_setting").classList.contains("active")) document.querySelector("#user_setting").remove("active");
        if(document.querySelector("#user_profile").classList.contains("active")) document.querySelector("#user_profile").remove("active");
        location = '/user/myPage';
    }
}

window.onload=()=>{
    let base = new Base();
    let user = new User();
}
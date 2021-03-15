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
                    if(user == false){alert("로그인 후 이용가능 합니다."); location = "/";}
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
                    if(post == false){alert("로그인 후 이용가능 합니다."); location = "/";}
                    else{
                        document.querySelector("#user_photonum").innerHTML = `글갯수 : ${post.length}개`;
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
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>View</th>
                <th>Like</th>
                <th>날짜</th>
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
        <a href="#" id="user-delete" class="user_post_list_buttons">삭제</a> 
        <a href="#" id="user-mod"    class="user_post_list_buttons">수정</a>
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
        let check = confirm("해당글을 삭제하시겠습니까?");
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
        let check = confirm("수정페이지로 이동할까요?");
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
        document.querySelector("#user_title").innerHTML = "설정";
        document.querySelector("#user_posts_area").innerHTML = `
            <h2 id="user_settiing_before_check_title">본인확인을 위해 비밀번호를 입력해주세요.</h2>
            <input type = "password" id="user_setting_before_check" placeholder="비밀번호를 입력해주세요">
            <p id="user_setting_before_check_error"></p>
            <button id="user_setting_before_check_button">확인</button>
            `;
        if(document.querySelector("#user_profile").classList.contains("active")) document.querySelector("#user_profile").classList.remove("active");
        document.querySelector("#user_post_menu").classList.add("active");
        document.querySelector("#user_setting").classList.add("active");
    }

    userDel(){
        let check = confirm("탈퇴하시겠습니까?");
        if(check){
            $.ajax({
                url:"/user/delete",
                method:"post",
                data:{"id":this.user['id']},
                success:(data)=>{
                    let del = JSON.parse(data);
                    if(del !== false){
                        alert("탈퇴되었습니다.");
                        location = "/";
                    }else{
                        alert("탈퇴도중 문제가 발생하였습니다.");
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
                            <label for="user_setting_id">아이디</label>
                            <input type="text" name="user_setting_id" id="user_setting_id" class="user_setting_input" value = ${this.user['userid']}>
                        </div>
                        <div class="user_setting_box">
                            <label for="user_setting_name">이름</label>
                            <input type="text" name="user_setting_name" id="user_setting_name" class="user_setting_input" value = ${this.user['username']}>
                        </div>
                        <div class="user_setting_box">
                            <label for="user_setting_password">비밀번호</label>
                            <input type="password" name="user_setting_password" id="user_setting_password" class="user_setting_input">
                        </div>
                        <div class="user_setting_box">
                            <label for="user_setting_passwordc">비밀번호 확인</label>
                            <input type="password" name="user_setting_passwordc" id="user_setting_passwordc" class="user_setting_input">
                        </div>
                        <button id="user_setting_modify">확인</button>
                        <button id="user_setting_userDel">탈퇴하기</button>
                    `;
                }else document.querySelector("#user_setting_before_check_error").innerHTML = "일치하지않는 비밀번호입니다.";
            }
        });
    }

    UserSetModifiy(){
        let setid = document.querySelector("#user_setting_id").value;
        let setname = document.querySelector("#user_setting_name").value;
        let password = document.querySelector("#user_setting_password").value;
        let passwordc = document.querySelector("#user_setting_passwordc").value;
        if(password !== passwordc) alert("비밀번호와 비밀번호확인이 다릅니다.");
        else if(setid.length == 0 || setname.length == 0 || setid.password == 0 || setid.password == 0) alert("내용을 채워주세요!");
        else{
            // name
            $.ajax({
                url:"/user/search",
                method:"post",
                data:{"search":"username","search_word":setname},
                success:(data)=>{
                    if(data !== 'false'){alert("같은 이름의 유저가 존재합니다.");return;}
                }
            });
            // id
            if(setid.length < 3){alert("아이디는 3글자 이상이어야 합니다.");return;}
            //2.영문 혹은 숫자포함
            if(!(/^[a-z||A-Z||0-9]+$/.test(setid))){alert("아이디는 아이디는 영문 혹은 숫자로 이루어져야 합니다.");return;}
            //3.중복 X
            $.ajax({
                url:"/user/search",
                method:"post",
                data:{"search":"userid","search_word":setid},
                success:(data)=>{
                    if(data !== 'false'){alert("같은 아이디의 유저가 존재합니다.");return;}
                }
            });
            // password
            if(password.length < 8 ){alert("비밀번호는 8글자 이상이어야합니다.");return;}
            let reg = (/[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[~!@#$%^&*()_+|<>?:{}]/.test(password));
            if(!reg){alert("비밀번호는 비밀번호는 영문,숫자,특수기호를 한번씩 포함해야 합니다.");return;}
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
                    if(modify !== false){alert("회원정보가 수정되었습니다.");location="/user/myPage";}
                    else alert("수정중 문제가 발생했습니다.");
                }
            });
        }
    }

    userprofilesetting(mode = ""){
        if(mode == ""){
            document.querySelector("#user_title").innerHTML = "프로필 설정";
            document.querySelector("#user_posts_area").innerHTML = `
            <div id="user_profile_set_tool_box">
                    <a href="#" id="user_profile_set_photo" class="user_profile_set_tool">프로필 사진</a>
                    <a href="#" id="user_profile_set_comment" class="user_profile_set_tool">프로필 소개글</a>
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
                            <button id="user_profile_add" class="user_profile_add"><i class="fas fa-plus user_profile_add"></i> 사진 설정하기</button>
                            <button id="user_profile_photo_reset">사진 초기화</button>
                        </div>
                    </div>
                    <div id="user_profile_comment">
                        <textarea id="user_profile_comment_input"></textarea>
                    </div>
                    <button id="user_profile_set_ok">확인</button>
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
            if(comment.length == 0) alert('내용을 채워주세요!');
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
                        alert("소개글이 저장되었습니다!");
                        location = "/user/myPage";
                    }else{alert("저장도중 문제가 발생했습니다.");}
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
                        alert("프로필 사진이 설정되었습니다.");
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
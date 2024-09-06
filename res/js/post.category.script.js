$(document).ready(function(){
    const currentURL = window.location.pathname;
    const categoryname = currentURL.split('/').pop().replace('.html','');
    //마크다운 파일 목록 가져오기 getJSON
    $.getJSON('posts/posts.list.json', function(data){
        const mkFiles = data.posts.map(post => `posts/${post}`);
        
        //각각의 포스트를 가져와서 표시
        $.each(mkFiles, function(index, file){
            
            $.get(file, function(text){
                const { meta, content} = parseMarkDown(text);
                //console.log(meta);
                //console.log(content);

                //카테고리 배열
                const categories = ["travel", "sports", "foods", "webdev"];


                //메타데이터 저장 및 데이터가 없을 경우 기본값 설정
                const title = meta.title || 'Untitle Post';
                const date = meta.date || '날짜미상';
                const category = meta.category || '미분류';
                const image = meta.image || 'res/images/posts/default.jpg';

                //본문에서 HTML 코드 필터링
                const snippet = marked.parse(content.split("\n").slice(0, 10).join("\n")).replace(/<\/?[^>]+(>|$)/g, "");

                const postLink = `article.html?file=${file}`;

                //포스팅쓰기
                if(category == categoryname){
                const newPost = index === 0; //첫 포스트는 크게
                //html 만들기 
                const postHTML = `
                                          
                        <div class="${newPost ,'bg-white'}">
                            <div class="myposts m-3 p-5 shdow-sm">
                                <div class="img-box">
                                    <a href="postLink"><img src="${image}"></a>
                                    <span class="date">${date}</span>
                                </div>
                                <div class="content-box">
                                    <div class="category mt-4 mb-5"><span>${category}</span></div>
                                    <h1>${title}</h1>
                                    ${snippet}
                                </div>
                                <a href="${postLink}" class="more d-inline-block mt-3 mb-5">Read Full Article</a>
                            </div>
                        </div>`;
                
                //포스트를 id mypost에 append
                $("#mypost").append(postHTML);
                }
            });
        });
    });

    function parseMarkDown(text){
        const regex = /^---\s*([\s\S]+?)\s*---\s*([\s\S]*)$/;
        const match = text.match(regex);
       
        if(match){
            const meta = {};
            match[1].split('\n').forEach(line =>{
                const [key, value] = line.split(':').map(str => str.trim());
                if(key && value){
                    // console.log(key, " - ", value);
                    meta[key] = value.replace(/['"]/g, ''); //따옴표 제거
                }
            });
            const content = match[2];
            return {meta, content};
        }else{
            return {meta: {}, content : text}
        }
    }
});
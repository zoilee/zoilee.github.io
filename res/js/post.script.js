$(document).ready(function(){


    const postsPerPage = 5;
    const pagesPerGroup = 10;
    let currentPage = 1;
    let totalPosts = 0;
    let totalPages = 0;

    function  postLoad(page){
        
    //마크다운 파일 목록 가져오기 getJSON
        $.getJSON('posts/posts.list.json', function(data){
            
            totalPosts = data.posts.length;
            const totalPages = Math.ceil(totalPosts / postsPerPage);
            const start = (page - 1) * postsPerPage;
            const end = start + postsPerPage; 
            const postsToshow = data.posts.slice(start, end);

            
            const mkFiles = data.posts.map(post => `posts/${post}`);
            
            $("#myposts").empty();


            //각각의 포스트를 가져와서 표시
            $.each(postsToshow, function(index, file){
                
                $.get(`posts/${file}`, function(text){
                    const { meta, content} = parseMarkDown(text);
                    //console.log(meta);
                    //console.log(content);

                    //메타데이터 저장 및 데이터가 없을 경우 기본값 설정
                    const title = meta.title || 'Untitle Post';
                    const date = meta.date || '날짜미상';
                    const category = meta.category || '미분류';
                    const image = meta.image || 'res/images/posts/default.jpg';

                    //본문에서 HTML 코드 필터링
                    const snippet = marked.parse(content.split("\n").slice(0, 10).join("\n")).replace(/<\/?[^>]+(>|$)/g, "");

                    const postLink = `article.html?file=${file}`;

                    //포스팅쓰기

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

                }).fail(function(){
                    console.error("데이터를 읽어오는데 에러가 발생했습니다.", file);
                });
            });
                //페이징 함수
            function renderPagination(totalPages, currentPage){
                const currentGroup = Math.ceil(currentPage /pagesPerGroup);
                const startPage = (currentGroup - 1) * pagesPerGroup +1 ;
                const endPage = Math.min(startPage + pagesPerGroup -1, totalPages);
                let pageHtml = '';
                //이전
                if(currentGroup > 1) {
                    const pervGroupPage = (currentGroup - 1) * pagesPerGroup;
                    pageHtml += `
                        <li class="page-item">
                            <a class="page-link" href="${pervGroupPage}">
                                <i class="ri-arrow-left-s-line"></i>
                            </a>
                        </li>
                    `;
                }
                for(let i  = startPage; i <= endPage; i++){
                    let active = currentPage === i ? " active" : "";
                    console.log(currentPage,",", i);
                    
                    pageHtml += `
                        <li class="page-item ${active}">
                            <a class="page-link" href="${i}">
                                ${i}
                            </a>
                        </li>
                    `;
                }

                //다음
                if(currentGroup * pagesPerGroup < totalPages ){
                    const nextGroupPage = currentGroup * pagesPerGroup + 1;
                    pageHtml += `
                        <li class="page-item">
                            <a class="page-link" href="${nextGroupPage}">
                                <i class="ri-arrow-right-s-line"></i>
                            </a>
                        </li>
                    `;
                }

                $('.pagination').html(pageHtml);
                
            }

        
            renderPagination(totalPages, currentPage);
        
        });
    } // endpost
   
    postLoad(currentPage);
    
    $(document).on("click", '.page-link', function(e){
        e.preventDefault();
        const pg = $(this).attr("href");
        if(pg !== currentPage){
            currentPage = pg;
            postLoad(currentPage);
            renderPagination(totalPages, currentPage);
        }
    })
    



}); //.jquery


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
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SubMenu from '../SubMenu';


function MemberList() {
    const [memberList,setMemberList] = useState([]);
    const [page , setPage] = useState(1);
    const navigate = useNavigate();
    const observbox = useRef(null);
    const [hasmore ,setHasMore] = useState(true);
    const [search , setSearch] = useState("");

    useEffect(()=>{
        fetch("/api/admin/getmemberList/"+page+"?search="+encodeURIComponent(search)).then(result=>{
            if(!result.ok)  throw new Error("네트 워크 연결 실패");
            return result.json();
        }).then(data =>{
            // console.log(data);
            setMemberList(prev=>[...prev , ...data.memberList]);
            if(data.memberList.length == 0) setHasMore(false);
        }).catch(err=>{console.error(err)});
    },[page]);

    useEffect(()=>{
        let observer = new IntersectionObserver(intersection,{
            rootMargin:"0px",
            threshold:1.0
        });

        if(observbox.current) observer.observe(observbox.current);

        return()=>{
            if(observbox.current) observer.unobserve(observbox.current);
        }
    },[hasmore]);


    let intersection = (entries)=>{
        if(entries[0].isIntersecting && hasmore) setPage(prev => prev+1);
    }
    const searchgo = async()=>{
        setMemberList([]);
        setHasMore(true);
        setPage(1);
     }

    async function changeUseYn(userid , ch){
        let useyn = 'N';
        if(!ch) useyn = 'Y';
        try{
            
           let result =  await fetch("/api/admin/changeUseyn?userid="+userid+"&useyn="+useyn,{method:"GET"});
            if(result.ok){
                setMemberList([]);
                setHasMore(true);
                setPage(1);
            }
        }catch(err){
            console.error(err);
        }
     }

  return (
    <div className='adminContainer'>
            <SubMenu />
            <div className='btns' style={{display:"flex", margin:"5px"}}>
                <input type="text" value={search} onChange={(e)=>{setSearch(e.currentTarget.value)}} /> <button onClick={searchgo}>검색</button>
                <button style={{marginLeft:"auto"}} onClick={()=>{ navigate('/writeproduct') }}>상품등록</button>
            </div>
            <div className='productTable'>
                <div className='row'>
                    <div className='col'>선택<br/> 휴면 / 탈퇴</div>
                    <div className='col'  style={{flex:"1"}}>User Id</div>
                    <div className='col'>서명</div>
                    <div className='col'>Phone</div>
                    <div className='col'  style={{flex:"2"}}>배송주소</div>
                    <div className='col'>Provider</div>
                    <div className='col'>가입일</div>
                </div>
                {
                    (memberList)?(
                        memberList.map((member, idx)=>{
                            return (
                                <div className='row' key={idx}>
                                    <div className='col'>
                                        {
                                            (member.useyn =='N')?( 
                                                <div>
                                                    탈퇴 회원
                                                    <input type="checkbox" value={member.userid} onChange={(e)=>{changeUseYn(member.userid, e.currentTarget.checked)}} checked />
                                                </div>
                                            ):(<div>회원
                                                <input type="checkbox" value={member.userid} onChange={(e)=>{changeUseYn(member.userid, e.currentTarget.checked)}} />
                                            </div>)
                                        }
                                       
                                    </div>
                                    <div className='col'  style={{flex:"1"}}>{member.userid}</div>
                                    <div className='col'>{member.name}</div>
                                    <div className='col'>{member.phone}</div>
                                    <div className='col' style={{flex:"2"}}>&nbsp;&nbsp;{member.address1} {member.address2}</div>
                                    <div className='col'>{member.provider}</div>
                                    <div className='col'>{member.indate&&member.indate.substring(0, 10)}</div>
                                </div>
                            )
                        })
                    ):(<span>loading...</span>)
                }
            </div>

        <div ref={observbox} style={{height:"10px"}}></div>
    </div>
  )
}

export default MemberList

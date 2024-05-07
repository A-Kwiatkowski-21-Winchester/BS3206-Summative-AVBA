
import './ViewAllArticles.css'
import {useEffect, useState} from 'react'

export default function ViewAllArticles(){

    const [articles, setArticles] = useState([])
    const [showSelectedArticle, setShowSelectedArticle] = useState({})
    const [showAllArticles, setShowAllArticles] = useState(true)

    useEffect(() => {
        const getArticles = async () => {
            const response = await fetch('http://localhost:8080/api/mentalhealth')
            const responseData = await response.json()

            if (response.ok){
                setArticles(responseData)
            }
        }  
        getArticles()
    }, [])

     function ViewArticle(title, author, date, content){
        setShowAllArticles(false)

        setShowSelectedArticle({title, author, date, content})
    }

    function returnToAllArticles(){
        window.location.reload()
    }
    
    return(
        <div>
            <h1 className="title">Mental Health Articles</h1>
            {
                showAllArticles? 
                <div className="card">       
                    {articles.map((article) => (
                        <div className="cards">
                            <p key={article._id}>{article.title}</p>
                            <p key={article.author}>By {article.author}</p>
                            {/* <p key={article.date}>Uploaded: {article.date}</p> */}
                            <button className="btn" onClick={() => ViewArticle(article.title, article.author, article.date, article.content)} >Read More</button>
                        </div>
                    ))}
                </div>
                
                :
                <div className="Articles">
                    <h1>{showSelectedArticle.title}</h1>
                    <h2>By {showSelectedArticle.author}</h2>
                    <h5>Created: {showSelectedArticle.date}</h5>
                    <p className="content">{showSelectedArticle.content}</p>
                    <button className ="btn" onClick={returnToAllArticles}>Back</button>
                </div>
               


            }
            
           
        </div>
       
    );
}
import { Alert } from 'bootstrap';
import './CreateArticle.css';
import { useState } from 'react';

export default function CreateArticle(){

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [date, setDate] = useState('');
    const [content, setContent] = useState('')



    async function onSubmit(e){
        e.preventDefault();


        const articleDetails = {title, author, date, content}
        
        const response = await fetch('http://localhost:8080/api/mentalhealth/create',{
            method: 'POST',
            body: JSON.stringify(articleDetails),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if(!response.ok){
            console.log(json.error)
        }
        if (response.ok){
            console.log(json)
            alert("Success, article created!")
        }
    }
    return(
        <div className='article'>
            <form className="articleform" onSubmit={onSubmit}>
                <h1 className="title">Create An Article</h1>
                <label>Title</label>
                <input type="text" 
                placeholder='Name of Article'
                onChange={(e) => setTitle(e.target.value)}
                value = {title}
                required/>

                <label>Author</label>
                <input type="text" 
                placeholder='Author Name'
                onChange={(e) => setAuthor(e.target.value)}
                value = {author}
                required/>

                <label>Date</label>
                <input type="Date"
                onChange={(e) => setDate(e.target.value)}
                value = {date}
                required/>


                <label>Content</label>
                <textarea type="text" 
                placeholder='Main body of Article'
                onChange={(e) => setContent(e.target.value)}
                value = {content}
                required/>

                <button className="btn" type="submit">Submit</button>
                    
            </form>
        </div>
    );
}


/**
 * ID
 * Title
 * Topic
 * Date
 * Author
 * Content
 * Image
 */
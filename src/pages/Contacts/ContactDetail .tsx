import React from 'react'
import useContactsZustand from './ContactsZustand'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function ContactDetail () {
    const {contacts} = useContactsZustand((state) => state) 
    const { id } = useParams()
    useEffect(() => {
      if (id) {
        contacts(id);
      }
    }, [id]);
  return (
    <div>
      {contacts.map((contact: any) => (
        <div key={contact.id} className='border rounded-2xl p-3 mb-3 w-fit'>
          <h1>{contact.name}</h1>
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
          <p>{contact.note}</p>
          <p>{contact.created_at}</p>
          <p>{contact.updated_at}</p>
        </div>
      ))}
    </div>
  )
}

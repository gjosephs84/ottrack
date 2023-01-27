import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_EMAILS = gql`
query GetEmails{
    usersPermissionsUsers(filters: { role: { name: { contains: "Employee" } } }) {
        data {
          attributes {
            email
          }
        }
      }
}
`;

const NotifyButton = ({subject, bodyText, buttonText}) => {
  const emails=[];
  const { loading, error, data } = useQuery(GET_EMAILS);
  if (loading) return <p>Loading emails ...</p>
  if (error) return <p>Error retrieving emails</p>
  data.usersPermissionsUsers.data.forEach(guard => {
    emails.push(guard.attributes.email);
  })
  let emailTemplate = "mailto:";
  emails.forEach(email => emailTemplate += `${email},`);
  emailTemplate.slice(0,-1);
  emailTemplate += `?subject=${subject}&body=${bodyText}`;
  return (
    <a href={emailTemplate}>
      <button>{buttonText}</button>
    </a>
  );
};

export default NotifyButton;
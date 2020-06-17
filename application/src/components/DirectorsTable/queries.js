import {gql} from 'apollo-boost';

export const directorsQueries = gql`
    query directorsQuery {
        directors {
            id
            name
            age           
            movies {
                id
                name               
            }  
        } 
    }
`;

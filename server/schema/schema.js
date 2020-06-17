const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');


const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        watched: {type: new GraphQLNonNull(GraphQLBoolean)},
        rate: {type: GraphQLInt},
        director: {
            type: DirectorType,
            resolve: (parent) => Directors.findById(parent.directorId)
        }
    }),
})

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        movies: {
            type: new GraphQLList(MovieType),
            resolve: (parent) => Movies.find({directorId: parent.id})
        }
    }),
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, {name, age}) {
                const director = new Directors({
                    name,
                    age
                });
                return director.save()
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                directorId: {type: GraphQLID},
                watched: {type: new GraphQLNonNull(GraphQLBoolean)},
                rate: {type: GraphQLInt},
            },
            resolve(parent, {name, genre, directorId, rate, watched}) {
                const movie = new Movies({
                    name,
                    genre,
                    directorId,
                    rate,
                    watched,
                });
                return movie.save()
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: {id: {type: GraphQLID}},
            resolve: (parent, args) => Directors.findByIdAndRemove(args.id)
        },
        deleteMovie: {
            type: MovieType,
            args: {id: {type: GraphQLID}},
            resolve: (parent, args) => Movies.findByIdAndRemove(args.id)
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, {id, name, age}) {
                return Directors.findByIdAndUpdate(
                   id,
                    {$set: {name, age}},
                    {new: true}
                );
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                directorId: {type: GraphQLID},
                watched: {type: new GraphQLNonNull(GraphQLBoolean)},
                rate: {type: GraphQLInt},
            },
            resolve(parent, {id, name, genre, directorId, rate, watched}) {
                return Movies.findByIdAndUpdate(
                    id,
                    {
                        $set: {
                            name,
                            genre,
                            directorId,
                            rate,
                            watched,
                        }
                    },
                    {new: true}
                );
            }
        },
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: {id: {type: GraphQLID}},
            resolve: (parent, args) => Movies.findById(args.id)
        },
        director: {
            type: DirectorType,
            args: {id: {type: GraphQLID}},
            resolve: (parent, args) => Directors.findById(args.id)
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve: () => Movies.find({}),
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve: () => Directors.find({}),
        }
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
})

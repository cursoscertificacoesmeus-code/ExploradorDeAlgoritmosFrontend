package br.com.rodrigo.graphexplorerapi.service;

import br.com.rodrigo.graphexplorerapi.dto.GraphDTO;
import org.jgrapht.Graph;
import org.jgrapht.graph.*;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class GraphService {

    public Graph<String, DefaultEdge> buildGraphFromDTO(GraphDTO graphDTO) {
        Graph<String, DefaultEdge> graph;

        // Escolhe a implementação correta do grafo com base nas propriedades
        if (graphDTO.isWeighted()) {
            if (graphDTO.isDirected()) {
                graph = new DefaultDirectedWeightedGraph<>(DefaultEdge.class);
            } else {
                graph = new SimpleWeightedGraph<>(DefaultEdge.class);
            }
        } else {
            graph = graphDTO.isDirected()
                    ? new DefaultDirectedGraph<String, DefaultEdge>(DefaultEdge.class)
                    : new SimpleGraph<String, DefaultEdge>(DefaultEdge.class);
        }

        // Adiciona os vértices (nós)
        graphDTO.getNodes().forEach(nodeDTO -> graph.addVertex(nodeDTO.getId()));

        // Adiciona as arestas
        graphDTO.getEdges().forEach(edgeDTO -> {
            graph.addVertex(edgeDTO.getSource());
            graph.addVertex(edgeDTO.getTarget());
            DefaultEdge edge = graph.addEdge(edgeDTO.getSource(), edgeDTO.getTarget());
            if (graphDTO.isWeighted() && Objects.nonNull(edge) && Objects.nonNull(edgeDTO.getWeight())) {
                graph.setEdgeWeight(edge, edgeDTO.getWeight());
            }
        });

        return graph;
    }
}

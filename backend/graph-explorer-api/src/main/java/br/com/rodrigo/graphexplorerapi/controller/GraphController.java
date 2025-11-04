package br.com.rodrigo.graphexplorerapi.controller;

import br.com.rodrigo.graphexplorerapi.dto.GraphDTO;
import org.jgrapht.Graph;
import org.jgrapht.graph.DefaultEdge;
import br.com.rodrigo.graphexplorerapi.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/graph")
@CrossOrigin(origins = "http://localhost:5173") // Permite requisições do seu frontend
public class GraphController {

    private final GraphService graphService;

    @Autowired
    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @PostMapping("/process")
    public ResponseEntity<String> processGraph(@RequestBody GraphDTO graphDTO) {
        System.out.println("Grafo recebido!");
        System.out.println("Nós: " + graphDTO.getNodes().size());
        System.out.println("Arestas: " + graphDTO.getEdges().size());
        System.out.println("Direcionado: " + graphDTO.isDirected());
        System.out.println("Ponderado: " + graphDTO.isWeighted());
        System.out.println("Misto: " + graphDTO.isMixed());

        // Constrói o grafo JGraphT a partir do DTO
        Graph<String, DefaultEdge> graph = graphService.buildGraphFromDTO(graphDTO);

        // Confirma a construção do grafo no console
        System.out.println("Grafo JGraphT construído com " + graph.vertexSet().size() + " vértices e "
                + graph.edgeSet().size() + " arestas.");

        return ResponseEntity.ok("Grafo recebido e processado com sucesso!");
    }

}

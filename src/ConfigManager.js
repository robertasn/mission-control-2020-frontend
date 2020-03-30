import { isEqual } from "lodash";
/** The maximum number of graphs that can be displayed. */
const MAX_GRAPHS = 4;
const DEFAULT_ID = 0;
class ConfigManager {
  constructor() {
    this.graphID = DEFAULT_ID;
    this.setConfig(require("./config.json"));
  }

  /**
   * Unique ID generator for graphs
   */
  getGraphID = () => {
    return this.graphID++;
  };

  /**
   * GRAPH HANDLERS
   */
  addGraph = () => {
    if (this.config.graphs.length >= MAX_GRAPHS) {
      console.error(`Maximum number of graphs (${MAX_GRAPHS}) reached!`);
      return;
    }
    this.config.graphs.push({
      ID: this.getGraphID(),
      paths: []
    });
  };

  removeGraph = ID => {
    this.config.graphs = this.config.graphs.filter(graph => graph.ID !== ID);
  };

  /**
   * PATH HANDLERS
   */
  handlePath = (path, graphID) => {
    if (this.isPathSelected(path, graphID)) {
      this.removePath(path, graphID);
    } else {
      this.addPath(path, graphID);
    }
  };

  addPath = (path, graphID) => {
    this.config.graphs.find(graph => graph.ID === graphID).paths.push(path);
  };

  removePath = (path, graphID) => {
    this.config.graphs.find(
      graph => graph.ID === graphID
    ).paths = this.config.graphs
      .find(graph => graph.ID === graphID)
      .paths.filter(p => !isEqual(p, path));
  };

  isPathSelected = (path, graphID) => {
    try {
      return (
        this.config.graphs
          .find(graph => graph.ID === graphID)
          .paths.filter(p => isEqual(p, path)).length > 0
      );
    } catch (e) {
      return false;
    }
  };

  /*
   * CONFIG HANDLERS
   */
  getConfig = () => {
    return this.config;
  };

  isProperlyFormatted = json => {
    if (!json) {
      console.error("JSON not initialized!");
      return false;
    }
    if (!json.hasOwnProperty("graphs")) {
      console.error('Missing field in config JSON: "graphs".');
      return false;
    }
    if (!Array.isArray(json.graphs)) {
      console.error(
        `Invalid field in config JSON: graphs should be array but got ${typeof json.graphs}`
      );
      return false;
    }

    // TODO: handle identical ID values
    const problems = [];
    json.graphs.forEach((graph, i) => {
      const graphNum = i + 1;
      if (!graph.hasOwnProperty("paths")) {
        problems.push(`Missing field in graph ${graphNum}: "paths"`);
      } else if (!Array.isArray(graph.paths)) {
        problems.push(
          `Invalid field in graph ${graphNum}: "paths" should be an array but got ${typeof graph.paths}`
        );
      } else if (graph.paths.length !== 0) {
        if (!graph.paths.every(path => Array.isArray(path))) {
          problems.push(
            `Invalid field in graph ${graphNum}: "paths" should be an array of arrays`
          );
        } else if (
          !graph.paths.every(path => path.every(key => typeof key === "string"))
        ) {
          problems.push(
            `Invalid field in graph ${graphNum}: "paths" should be an array of string arrays`
          );
        }
      }
    });
    if (problems.length !== 0) {
      console.error(problems.join("\n"));
      return false;
    }
    return true;

    // WITHOUT ERROR MESSAGES:
    // return json.graphs.every(
    //   graph =>
    //     graph.hasOwnProperty("paths") &&
    //     Array.isArray(graph.paths) &&
    //     graph.paths.every(path => Array.isArray(path)) &&
    //     graph.paths.every(path => path.every(key => typeof key === "string"))
    // );
  };

  /**
   *
   *
   * @param {Blob} file
   * @returns
   */
  parseConfig = file => {
    if (!file) {
      console.error("Config file must not be undefined.");
      return;
    }
    if (!file.name.endsWith(".json")) {
      alert("Config must be a JSON file!");
      return;
    }
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      const json = JSON.parse(reader.result);
      if (!this.isProperlyFormatted(json)) {
        alert("JSON improperly formatted");
        return;
      }
      this.setConfig(json);
      console.log("Successfully set new config file.");
    };
  };

  setConfig = json => {
    json.graphs.forEach(graph => {
      graph.ID = this.getGraphID();
    });
    this.config = json;
  };

  shouldEnableAdd = () => {
    return this.state.graphs.length < MAX_GRAPHS;
  };
}

const configManager = new ConfigManager();
export default configManager;

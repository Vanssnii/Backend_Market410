const productoModel = require('../models/producto-model');

const getProductos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const order_by = req.query.order_by || 'id_ASC';
    const vendedor_id = req.query.vendedor_id ? parseInt(req.query.vendedor_id) : undefined;

    const productos = await productoModel.getProductos(limit, page, order_by, vendedor_id);
    res.json(productos);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const getProductosFiltrados = async (req, res) => {
  try {
    const productos = await productoModel.getProductosFiltrados(req.query);
    res.json(productos);
  } catch (err) {
    console.error("Error al filtrar productos:", err);
    res.status(500).json({ error: "Error al filtrar productos" });
  }
};

const createProducto = async (req, res) => {
  try {
    const nuevoProducto = await productoModel.createProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

const getProductoPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const producto = await productoModel.getProductoPorId(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error('Error obteniendo el producto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const updateProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productoActualizado = await productoModel.updateProducto(id, req.body);
    res.json(productoActualizado);
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const exito = await productoModel.deleteProducto(id);
    if (exito) {
      res.json({ mensaje: "Producto eliminado" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

const calificarProducto = async (req, res) => {
  try {
    const productoId = parseInt(req.params.id);
    const usuarioId = req.usuario.id;
    const { rating } = req.body;

    if (!productoId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Datos inválidos: rating debe ser entre 1 y 5" });
    }

    const resultado = await productoModel.guardarCalificacion(productoId, usuarioId, rating);
    res.status(201).json(resultado);
  } catch (err) {
    console.error("Error al guardar calificación:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  getProductos,
  getProductosFiltrados,
  createProducto,
  getProductoPorId,
  updateProducto,
  deleteProducto,
  calificarProducto
};

<?php
class ImageModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif');

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    //Subir imagen de una producto registrada
    public function uploadFile($object)
    {
        try {
            $file = $object['file'];
            $producto_id = $object['producto_id'];
            //Obtener la información del archivo
            $fileName = $file['name'];
            $tempPath = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];

            if (!empty($fileName)) {
                //Crear un nombre único para el archivo
                $fileExt = explode('.', $fileName);
                $fileActExt = strtolower(end($fileExt));
                $fileName = "producto-" . uniqid() . "." . $fileActExt;
                //Validar el tipo de archivo
                if (in_array($fileActExt, $this->valid_extensions)) {
                    //Validar que no exista
                    if (!file_exists($this->upload_path . $fileName)) {
                        //Validar que no sobrepase el tamaño
                        if ($fileSize < 2000000 && $fileError == 0) {
                            //Moverlo a la carpeta del servidor del API
                            if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {
                                //Guardarlo en la BD
                                $sql = "INSERT INTO ImagenProducto (producto_id,imagen) VALUES ($producto_id, '$fileName')";
                                $vResultado = $this->enlace->executeSQL_DML($sql);
                                if ($vResultado > 0) {
                                    return 'Imagen creada';
                                }
                                return false;
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Obtener una imagen de un producto
    public function getImagen($idProducto)
    {
        try {
            // Consulta SQL
            $vSql = "SELECT * FROM ImagenProducto WHERE producto_id = $idProducto";
            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar todas las imágenes (puede ser un array vacío si no hay)
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function deleteImagen($id)
    {
        try {
            // Obtener el nombre del archivo
            $vSqlCheck = "SELECT imagen FROM ImagenProducto WHERE id = $id";
            $vResultCheck = $this->enlace->ExecuteSQL($vSqlCheck);

            if (empty($vResultCheck)) {
                return ['success' => false, 'message' => 'La imagen no existe'];
            }

            $fileName = $vResultCheck[0]['imagen'];
            $filePath = $this->upload_path . $fileName;

            // Eliminar de la base de datos
            $vSql = "DELETE FROM ImagenProducto WHERE id = $id";
            $vResultado = $this->enlace->ExecuteSQL_DML($vSql);

            if ($vResultado > 0) {
                // Eliminar físicamente
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                return ['success' => true, 'message' => 'Imagen eliminada'];
            }

            return ['success' => false, 'message' => 'No se pudo eliminar la imagen'];
        } catch (Exception $e) {
            handleException($e);
            return ['success' => false, 'message' => 'Error al eliminar la imagen'];
        }
    }
}

import cv2

class CameraManager:
    def __init__(self, source=0):
        """
        Initialise la caméra.
        :param source: 0 pour la webcam locale, ou un lien RTSP/HTTP pour une autre source
        """
        self.capture = cv2.VideoCapture(source)

    def get_frame(self):
        """
        Capture une image de la caméra.
        :return: L'image encodée en JPEG ou None
        """
        ret, frame = self.capture.read()
        if not ret:
            return None
        _, buffer = cv2.imencode('.jpg', frame)
        return buffer.tobytes()

    def release(self):
        """
        Libère la caméra.
        """
        self.capture.release()

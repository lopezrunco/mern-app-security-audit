import { motion } from "framer-motion";

function UserCard({ user }) {
  return (
    <div className="col-lg-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <div className="card p-4 mb-4">
            <h4>{user.nickname}</h4>
            <span><b>ID: </b>{user.id}</span>
            <span><b>Email: </b>{user.email}</span>
            <span><b>Rol: </b>{user.role}</span>
            <span><b>MFA habilitado: </b>{user.mfaEnabled ? 'Sí' : 'No'}</span>
        </div>
      </motion.div>
    </div>
  );
}

export default UserCard;

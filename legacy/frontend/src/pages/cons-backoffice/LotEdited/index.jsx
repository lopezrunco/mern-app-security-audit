import SuccessMessage from "../../../components/SuccessMessage";

// TO DO: Refactor this code to use the Message page and the event id to navigate to the event
function LotEdited() {
  return (
    <SuccessMessage
      title="Lote editado"
      message="El lote ha sido editado con éxito."
      redirectingMessage="Redirigiendo al Mis remates..."
      duration="5000"
      breadcrumbsLocation="Lote editado"
      navigateTo={`/consignatarios/mis-remates`}
    />
  );
}

export default LotEdited;

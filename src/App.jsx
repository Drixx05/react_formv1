import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
	const schema = yup.object().shape({
		name: yup
			.string()
			.required("Le nom est requis")
			.min(8, "Le nom doit contenir au moins 8 caractères")
			.max(15, "Le nom ne doit pas dépasser 15 caractères"),
		dueDate: yup
			.string()
			.required("La date est requise")
			.matches(
				/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
				"La date doit être au format JJ/MM/AAAA"
			)
			.test("dateValidation", "La date n'est pas valide", (value) => {
				if (!value) return true;

				const [day, month, year] = value.split("/");
				const inputDate = new Date(year, month - 1, day);
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				const isValidDate =
					!isNaN(inputDate) &&
					inputDate.getDate() === parseInt(day) &&
					inputDate.getMonth() === parseInt(month) - 1 &&
					inputDate.getFullYear() === parseInt(year);

				const isFutureDate = inputDate >= today;

				if (!isValidDate) throw new yup.ValidationError("Date invalide");

				if (!isFutureDate)
					throw new yup.ValidationError(
						"La date ne peut pas être dans le passé"
					);

				return true;
			}),
		priority: yup
			.string()
			.oneOf(["low", "medium", "high"], "Priorité invalide"),
		isChecked: yup.boolean(),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			name: "",
			dueDate: "",
			priority: "low",
			isChecked: false,
		},
		resolver: yupResolver(schema),
	});

	const onSubmit = (data) => {
		console.log(data);
		reset();
	};

	return (
		<Container as="main" className="py-5 d-flex justify-content-center">
			<Row className="justify-content-center ">
				<Col>
					<h1 className="mb-4 text-center">Formulaire de tâche</h1>
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Form.Group className="mb-3" controlId="formBasicName">
							<Form.Label>Nom</Form.Label>
							<Form.Control
								type="text"
								{...register("name", { required: "Le nom est requis" })}
								placeholder="Renseigner le nom de la tâche"
								isInvalid={!!errors.name}
							/>
							{errors.name && (
								<Form.Control.Feedback type="invalid">
									{errors.name.message}
								</Form.Control.Feedback>
							)}
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicDate">
							<Form.Label>Date</Form.Label>
							<Form.Control
								type="date"
								{...register("dueDate", { required: "La date est requise" })}
								isInvalid={!!errors.dueDate}
							/>
							{errors.dueDate && (
								<Form.Control.Feedback type="invalid">
									{errors.dueDate.message}
								</Form.Control.Feedback>
							)}
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicPriority">
							<Form.Label>Priorité</Form.Label>
							<Form.Select {...register("priority")}>
								<option value="low">Basse</option>
								<option value="medium">Moyenne</option>
								<option value="high">Haute</option>
							</Form.Select>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicCheckbox">
							<Form.Check
								type="checkbox"
								label="Tâche terminée"
								{...register("isChecked")}
							/>
						</Form.Group>

						<Button variant="primary" type="submit">
							Envoyer
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

export default App;

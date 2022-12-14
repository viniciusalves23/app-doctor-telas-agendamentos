const Medico = require("../models/medico.model");
const Paciente = require("../models/paciente.model");
const Agenda = require("../models/agenda.model");

exports.create = async (req, res, next) => {
  const { medico_id, paciente_id } = req.params;
  const { data, hora } = req.body;
  try {
    const paciente = await Paciente.findByPk(paciente_id);

    const medico = await Medico.findByPk(medico_id);

    if (!medico) {
      return res.status(400).send({ message: "Medico não encontrado" });
    }

    if (!paciente) {
      return res.status(400).send({ message: "Paciente não encontrado" });
    }

    if (!data || !hora) {
      return res.status(400).send({ message: "Data e a hora é obrigatório" });
    }

    const agenda = await Agenda.create({
      data,
      hora,
      medico_id,
      paciente_id,
    });

    return res.status(201).send({ agenda });
  } catch (error) {
    return res.status(500).send({ error: "Ocorreu um erro no agendamento" });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const agenda = await Agenda.findAll();

    if (!agenda || agenda.length === 0) {
      return res.status(400).send({ message: "Nenhum agendamento cadastrado" });
    }

    return res
      .status(200)
      .send({ message: "Agendamentos encontrado com sucesso!", agenda });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Ocorreu um erro ao buscar os agendamentos" });
  }
};

exports.findById = async (req, res, next) => {
  const { agenda_id } = req.params;
  try {
    const agenda = await Agenda.findByPk(agenda_id);

    if (!agenda) {
      return res.status(400).send({ message: "Agendamento não encontrado" });
    }

    return res
      .status(200)
      .send({ message: "Agendamento encontrado com sucesso!", agenda });
  } catch (error) {
    res.status(500).send({ error: "Ocorreu um erro ao buscar o agendamento" });
  }
};

exports.findByMedico = async (req, res, next) => {
  const { medico_id } = req.params;
  try {
    let medico = await Medico.findByPk(medico_id);

    if (!medico) {
      res
        .status(400)
        .send({ error: "Ocorreu um erro ao buscar o agendamento" });
    }

    medico = await Medico.findByPk(medico_id, {
      include: { association: "agendas" },
    });

    return res.status(200).send({ medico });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Ocorreu um erro ao buscar o agendamento" });
  }
};

exports.findByPaciente = async (req, res, next) => {
  const { paciente_id } = req.params;
  try {
    let paciente = await Paciente.findByPk(paciente_id);

    if (!paciente) {
      return res.status(400).send({ error: "Paciente não encontrado" });
    }

    paciente = await Paciente.findByPk(paciente_id, {
      include: { association: "agendas" },
    });

    return res.status(200).send({ paciente });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Ocorreu um erro ao buscar o agendamento" });
  }
};

exports.update = async (req, res, next) => {
  const { medico_id, paciente_id, agenda_id } = req.params;
  const { data, hora, status_agendamento } = req.body;
  try {
    const medico = await Medico.findByPk(medico_id);
    const paciente = await Paciente.findByPk(paciente_id);
    const agenda = await Agenda.findByPk(agenda_id);

    if (!medico) {
      return res.status(400).send({ error: "Médico não encontrado" });
    }

    if (!paciente) {
      return res.status(400).send({ error: "Paciente não encontrado" });
    }

    if (!agenda) {
      return res.status(400).send({ error: "agendamento não encontrado" });
    }

    if (!data || !hora) {
      return res.status(400).send({ message: "Data e a hora é obrigatório" });
    }

    if (!status_agendamento) {
      return res
        .status(400)
        .send({ message: "É necessário informar a situação do agendamento" });
    }

    const agenda_atualizada = await Agenda.update(
      {
        data,
        hora,
        status_agendamento,
        medico_id,
        paciente_id,
      },
      {
        where: { id: agenda_id },
      }
    );

    return res.status(201).send({
      message: "Agendamento atualizado com sucesso",
      agenda_atualizada,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Ocorreu algum erro ao atualizar os dados" });
  }
};

exports.delete = async (req, res, next) => {
  const { agenda_id } = req.params;
  try {
    const agenda = await Agenda.findByPk(agenda_id);

    if (!agenda) {
      return res.status(400).send({ message: "Agendamento não encontrado" });
    }

    await Agenda.destroy({
      where: { id: agenda_id },
    });

    return res
      .status(200)
      .send({ message: "Agendamento excluído com sucesso" });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Ocorreu algum erro ao deletar o agenda", error });
  }
};

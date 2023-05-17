import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Pokecard from "../components/Pokecard";
import userEvent from "@testing-library/user-event";
import Modal from "../components/Modal";
import { dadosdetodosospokemons } from "./dadosdospokemos";

jest.mock("axios");

const axiosResponseMock = {
  //   data: dadosdetodosospokemons,
  data: {
    name: "NameMockado",
    sprites: {
      id: 1,
      front_default: "UrlMockado",
    },
    types: [
      {
        type: {
          name: "Type1Mock",
        },
      },
      {
        type: {
          name: "Type2Mock",
        },
      },
    ],
  },
};

const activeModal = {
  sprites: {
    front_default:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
  },
  id: "2",
  name: "ivysaur",
  types: [
    {
      type: "grass",
    },
    {
      type: "poison",
    },
  ],
  weight: 130 / 10,
  height: 10 / 10,
};

const addToCartMock = jest.fn();

describe("Teste do componente productcard", () => {
  beforeEach(() => {
    axios.mockReset();
  });
  test("Renderiza a pagina", async () => {
    axios.get.mockResolvedValueOnce(axiosResponseMock);
    render(<Pokecard />);
    //Mostra o html no test
    screen.debug();
    //Simula o useeffect
    await waitFor(() => {});
    //Mostra o html depois
    screen.debug();
  });
  test("Renderiza a mensagem de carregamento", async () => {
    axios.get.mockResolvedValueOnce(axiosResponseMock);
    render(<Pokecard />);

    screen.debug();

    const loading = screen.getByText("Loading...");

    expect(loading).toBeInTheDocument();
    expect(screen.queryByText("NameMockado")).not.toBeInTheDocument();

    await waitFor(() => {});

    screen.debug();
    screen.logTestingPlaygroundURL();
  });
  test("Renderiza os dados do produto", async () => {
    axios.get.mockResolvedValueOnce(axiosResponseMock);
    render(<Pokecard />);

    await waitFor(() => {
      expect(screen.getByText("NameMockado")).toBeInTheDocument();
      expect(
        screen.getByRole("img", { src: /UrlMockado/i })
      ).toBeInTheDocument();
      expect(screen.getByText("Type1Mock")).toBeInTheDocument();
      expect(screen.getByText("Type2Mock")).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    screen.logTestingPlaygroundURL();

    screen.debug();
  });

  test("Teste de interacao com o user ao clicar no card do pokemon", async () => {
    const User = userEvent.setup();
    render(<Modal activeModal={activeModal} closeModal={addToCartMock} />);

    const closeButton = screen.getByRole("button", { name: /❌/i });

    await User.click(closeButton);

    //checa se a funcao recebeu os dados
    expect(addToCartMock).toBeCalled;

    //verificar que foi chamado so 1x
    expect(addToCartMock).toBeCalledTimes(1);
  });
});

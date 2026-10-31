import unittest
from unittest.mock import patch
import json
import io
import os
import importlib.util

# Load the hook module
hook_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "check-credentials.py")
)
spec = importlib.util.spec_from_file_location("check_credentials", hook_path)
check_credentials = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check_credentials)


class TestCheckCredentials(unittest.TestCase):

    @patch.dict(os.environ, {"NOTION_TOKEN": "secret_123"}, clear=True)
    def test_is_configured_token(self):
        self.assertTrue(check_credentials._is_configured())

    @patch.dict(os.environ, {}, clear=True)
    @patch("os.path.exists")
    @patch("os.path.expanduser")
    def test_is_configured_file(self, mock_expanduser, mock_exists):
        mock_expanduser.return_value = "/home/user"
        # Mocking exists to return True only for the home config path
        mock_exists.side_effect = lambda p: p == "/home/user/.config/mcp/config.enc"
        self.assertTrue(check_credentials._is_configured())

    @patch.dict(os.environ, {}, clear=True)
    @patch("os.path.exists")
    def test_not_configured(self, mock_exists):
        mock_exists.return_value = False
        self.assertFalse(check_credentials._is_configured())

    @patch("sys.stdin", io.StringIO(json.dumps({"tool_name": "any_tool__setup"})))
    @patch("sys.exit", side_effect=SystemExit)
    def test_main_exempt_tool(self, mock_exit):
        with self.assertRaises(SystemExit):
            check_credentials.main()
        mock_exit.assert_called_with(0)

    @patch.dict(os.environ, {}, clear=True)
    @patch("os.path.exists")
    @patch("sys.stdin", io.StringIO(json.dumps({"tool_name": "list_pages"})))
    @patch("sys.exit", side_effect=SystemExit)
    @patch("sys.stdout", new_callable=io.StringIO)
    def test_main_not_configured_hint(self, mock_stdout, mock_exit, mock_exists):
        mock_exists.return_value = False
        with self.assertRaises(SystemExit):
            check_credentials.main()

        mock_exit.assert_called_with(0)
        output = json.loads(mock_stdout.getvalue())
        self.assertIn(
            "better-notion-mcp: credentials not yet configured", output["message"]
        )

    @patch.dict(os.environ, {"NOTION_TOKEN": "secret_123"}, clear=True)
    @patch("sys.stdin", io.StringIO(json.dumps({"tool_name": "list_pages"})))
    @patch("sys.exit", side_effect=SystemExit)
    def test_main_configured_allowed(self, mock_exit):
        with self.assertRaises(SystemExit):
            check_credentials.main()
        mock_exit.assert_called_with(0)

    @patch("sys.stdin", io.StringIO("invalid json"))
    @patch("sys.exit", side_effect=SystemExit(2))
    @patch("sys.stdout", new_callable=io.StringIO)
    def test_main_invalid_json(self, mock_stdout, mock_exit):
        with self.assertRaises(SystemExit) as cm:
            check_credentials.main()

        self.assertEqual(cm.exception.code, 2)
        mock_exit.assert_called_with(2)
        output = json.loads(mock_stdout.getvalue())
        self.assertEqual(output["decision"], "block")
        self.assertIn(
            "Invalid input: payload must be a JSON dictionary", output["reason"]
        )

    @patch("sys.stdin", io.StringIO('["not a dict"]'))
    @patch("sys.exit", side_effect=SystemExit(2))
    @patch("sys.stdout", new_callable=io.StringIO)
    def test_main_not_dict_json(self, mock_stdout, mock_exit):
        with self.assertRaises(SystemExit) as cm:
            check_credentials.main()

        self.assertEqual(cm.exception.code, 2)
        mock_exit.assert_called_with(2)
        output = json.loads(mock_stdout.getvalue())
        self.assertEqual(output["decision"], "block")
        self.assertIn(
            "Invalid input: payload must be a JSON dictionary", output["reason"]
        )


if __name__ == "__main__":
    unittest.main()

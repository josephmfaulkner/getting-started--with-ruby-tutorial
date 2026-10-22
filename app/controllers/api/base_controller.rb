class Api::BaseController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private
    def not_found
      render_errors "Not found.", status: :not_found
    end

    # Renders a record's validation errors (or the given messages) as { errors: [...] }
    def render_errors(record_or_messages, status: :unprocessable_content)
      messages = record_or_messages.respond_to?(:errors) ? record_or_messages.errors.full_messages : Array(record_or_messages)
      render json: { errors: messages }, status: status
    end

    def render_notice(notice, status: :ok, **extra)
      render json: { notice: notice, **extra }, status: status
    end
end
